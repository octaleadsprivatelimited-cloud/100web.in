import { createServerFn } from "@tanstack/react-start";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { pool, postgres } from "@/lib/db.server";
import { z } from "zod";
import { team } from "./team-data";
import { services } from "./services-data";
import { industries } from "./industries-data";

let defaultTeamSeeded = false;
async function ensureDefaultTeamMembers() {
  if (defaultTeamSeeded) return;
  for (const member of team) {
    await pool.query(
      `INSERT INTO team_members(
        slug,name,role,department,location,bio,long_bio,linkedin,email,experience_years,
        skills,experience,education,achievements,video_url,avatar_initials,avatar_url,accent
      ) VALUES(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14,$15,$16,$17,$18
      ) ON CONFLICT(slug) DO NOTHING`,
      [
        member.slug, member.name, member.role, member.department, member.location,
        member.bio, member.longBio, member.linkedin || null, member.email || null,
        member.experienceYears, member.skills, JSON.stringify(member.experience),
        JSON.stringify(member.education), member.achievements, member.videoUrl || null,
        member.avatarInitials, member.avatarUrl || null, member.accent,
      ],
    );
  }
  defaultTeamSeeded = true;
}

async function ensureEditor(ctx: { db: any; userId: string }) {
  const sb = ctx.db as any;
  const { data, error } = await sb
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("editor")) {
    throw new Error("Forbidden");
  }
  return roles;
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    const { data } = await context.db
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return (data ?? []).map((r: { role: string }) => r.role);
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    await ensureDefaultTeamMembers();
    const sb = context.db as any;
    const [banners, activeBanners, teamMembers, blogPosts, customers] = await Promise.all([
      sb.from("popup_banners").select("id", { count: "exact", head: true }),
      sb
        .from("popup_banners")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      sb.from("team_members").select("id", { count: "exact", head: true }),
      sb.from("blog_posts").select("id", { count: "exact", head: true }),
      sb.from("profiles").select("id", { count: "exact", head: true }),
    ]);
    return {
      banners: banners.count ?? 0,
      activeBanners: activeBanners.count ?? 0,
      teamMembers: teamMembers.count || team.length,
      blogPosts: blogPosts.count ?? 0,
      customers: customers.count ?? 0,
    };
  });

// ---- Banners CRUD ----

export const listBanners = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    const { data, error } = await context.db
      .from("popup_banners")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const bannerSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  message: z.string().max(2000).nullish(),
  image_url: z.string().max(1000).nullish(),
  cta_label: z.string().max(80).nullish(),
  cta_url: z.string().max(500).nullish(),
  is_active: z.boolean().default(true),
  starts_at: z.string().nullish(),
  ends_at: z.string().nullish(),
  priority: z.number().int().default(0),
  position: z.enum(["top-left", "top-center", "top-right", "center", "bottom-left", "bottom-center", "bottom-right"]).default("bottom-right"),
  style_variant: z.enum(["classic", "gradient", "minimal", "image-focus"]).default("classic"),
  text_align: z.enum(["left", "center", "right"]).default("left"),
});

export const upsertBanner = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => bannerSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { id, ...values } = data;
    const payload = {
      ...values,
      image_url: data.image_url || null,
      starts_at: data.starts_at || null,
      ends_at: data.ends_at || null,
      created_by: context.userId,
    };
    const { data: row, error } = id
      ? await context.db
          .from("popup_banners")
          .update(payload)
          .eq("id", id)
          .select()
          .single()
      : await context.db.from("popup_banners").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteBanner = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { error } = await context.db.from("popup_banners").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- Team Members CRUD ----

export const listTeamMembers = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    await ensureDefaultTeamMembers();
    const { data, error } = await (context.db as any)
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      return team;
    }
    return data.map((d: any) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      role: d.role,
      department: d.department,
      location: d.location,
      bio: d.bio,
      longBio: d.long_bio,
      linkedin: d.linkedin || "",
      email: d.email || "",
      experienceYears: d.experience_years,
      skills: d.skills || [],
      experience: d.experience || [],
      education: d.education || [],
      achievements: d.achievements || [],
      videoUrl: d.video_url || undefined,
      avatarInitials: d.avatar_initials,
      avatarUrl: d.avatar_url || "",
      accent: d.accent,
    }));
  });

const teamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  bio: z.string().min(1),
  longBio: z.string().min(1),
  linkedin: z.string().url().or(z.literal("")).nullish(),
  email: z.string().email().or(z.literal("")).nullish(),
  experienceYears: z.number().int().nonnegative().default(0),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.any()).default([]),
  education: z.array(z.any()).default([]),
  achievements: z.array(z.string()).default([]),
  videoUrl: z.string().url().or(z.literal("")).nullish(),
  avatarInitials: z.string().min(1).max(3),
  accent: z.string().min(1),
  avatarUrl: z.string().max(1000).nullish(),
});

export const upsertTeamMember = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => teamMemberSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const payload = {
      slug: data.slug,
      name: data.name,
      role: data.role,
      department: data.department,
      location: data.location,
      bio: data.bio,
      long_bio: data.longBio,
      linkedin: data.linkedin || null,
      email: data.email || null,
      experience_years: data.experienceYears,
      skills: data.skills,
      experience: data.experience,
      education: data.education,
      achievements: data.achievements,
      video_url: data.videoUrl || null,
      avatar_initials: data.avatarInitials,
      accent: data.accent,
      avatar_url: data.avatarUrl || null,
    };
    const { data: row, error } = data.id
      ? await (context.db as any)
          .from("team_members")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()
      : await (context.db as any).from("team_members").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { error } = await (context.db as any).from("team_members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- Blog Posts CRUD ----

const blogPostSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().nullish(),
  cover_image: z.string().max(1000).nullish(),
  published_at: z.string().nullish(),
});

export const listBlogPosts = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    const { data, error } = await (context.db as any)
      .from("blog_posts")
      .select("*, author:profiles(full_name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertBlogPost = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => blogPostSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const payload = {
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      cover_image: data.cover_image || null,
      published_at: data.published_at || null,
      author_id: context.userId,
    };
    const { data: row, error } = data.id
      ? await (context.db as any)
          .from("blog_posts")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()
      : await (context.db as any).from("blog_posts").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { error } = await (context.db as any).from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- Service & Industry Pages ----

const managedPageSchema = z.object({
  kind: z.enum(["service", "industry"]),
  slug: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  pdf_url: z.string().url().or(z.literal("")).nullish(),
  is_active: z.boolean(),
});

export const listManagedPages = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .validator((d: { kind: "service" | "industry" }) => d)
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const table = data.kind === "service" ? "service_pages" : "industry_pages";
    const defaults = data.kind === "service" ? services : industries;
    const result = await (context.db as any).from(table).select("*");
    if (result.error) throw new Error(result.error.message);
    const saved = new Map((result.data ?? []).map((row: any) => [row.slug, row]));
    return defaults.map((item: any) => {
      const row: any = saved.get(item.slug);
      return {
        ...item,
        ...(row?.content ?? {}),
        id: row?.id,
        pdf_url: row?.pdf_url ?? "",
        is_active: row?.is_active ?? true,
      };
    });
  });

export const saveManagedPage = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((d: unknown) => managedPageSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const table = data.kind === "service" ? "service_pages" : "industry_pages";
    const payload = {
      slug: data.slug,
      content: data.content,
      pdf_url: data.pdf_url || null,
      is_active: data.is_active,
      updated_by: context.userId,
      updated_at: new Date().toISOString(),
    };
    const { data: row, error } = await (context.db as any)
      .from(table)
      .upsert(payload, { onConflict: "slug" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ---- Gallery CRUD ----

const galleryItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  image_url: z.string().min(1).max(1000),
  alt_text: z.string().min(1).max(300),
  category: z.string().min(1).max(80),
  caption: z.string().max(1000).nullish(),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const listGalleryItems = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    const { data, error } = await (context.db as any)
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertGalleryItem = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => galleryItemSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const payload = { ...data, caption: data.caption || null, created_by: context.userId };
    const { data: row, error } = data.id
      ? await (context.db as any).from("gallery_items").update(payload).eq("id", data.id).select().single()
      : await (context.db as any).from("gallery_items").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { error } = await (context.db as any).from("gallery_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- YouTube Videos CRUD ----

const videoSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  youtube_url: z.string().url(),
  description: z.string().max(2000).nullish(),
  category: z.string().min(1).max(80),
  thumbnail_url: z.string().max(1000).nullish(),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const listVideos = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    const { data, error } = await (context.db as any)
      .from("youtube_videos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertVideo = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => videoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const payload = {
      ...data,
      description: data.description || null,
      thumbnail_url: data.thumbnail_url || null,
      created_by: context.userId,
    };
    const { data: row, error } = data.id
      ? await (context.db as any).from("youtube_videos").update(payload).eq("id", data.id).select().single()
      : await (context.db as any).from("youtube_videos").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteVideo = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureEditor(context);
    const { error } = await (context.db as any).from("youtube_videos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---- Customers List ----

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureEditor(context);
    const { data, error } = await context.db
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ---- Public: active banner for site popup ----
export const getActiveBanner = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await postgres
    .from("popup_banners")
    .select("id, title, message, image_url, cta_label, cta_url")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] ?? null;
});

export const publicListTeamMembers = createServerFn({ method: "GET" }).handler(async () => {
  await ensureDefaultTeamMembers();
  const { data, error } = await postgres
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });
  if (error || !data || data.length === 0) {
    return team;
  }
  return data.map((d: any) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    role: d.role,
    department: d.department,
    location: d.location,
    bio: d.bio,
    longBio: d.long_bio,
    linkedin: d.linkedin || "",
    email: d.email || "",
    experienceYears: d.experience_years,
    skills: d.skills || [],
    experience: d.experience || [],
    education: d.education || [],
    achievements: d.achievements || [],
    videoUrl: d.video_url || undefined,
    avatarInitials: d.avatar_initials,
    avatarUrl: d.avatar_url || "",
    accent: d.accent,
  }));
});
