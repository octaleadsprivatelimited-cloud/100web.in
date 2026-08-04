import { createServerFn } from "@tanstack/react-start";
import { pool } from "./db.server";
import { services, type Service } from "./services-data";
import { industries, type Industry } from "./industries-data";

export type ManagedService = Service & { pdf_url?: string | null; is_active?: boolean; hero_video_url?: string | null };
export type ManagedIndustry = Industry & {
  description?: string;
  hero_title?: string;
  image_url?: string;
  hero_video_url?: string;
  pdf_url?: string | null;
  is_active?: boolean;
};

export type WebsitePortfolioItem = {
  id: string;
  title: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  project_url: string | null;
  is_featured: boolean;
};

async function overrides(table: "service_pages" | "industry_pages") {
  try {
    const { rows } = await pool.query(`SELECT slug,content,pdf_url,is_active FROM ${table}`);
    return new Map(rows.map((row) => [row.slug, row]));
  } catch {
    return new Map<string, any>();
  }
}

export const listPublicServices = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await overrides("service_pages");
  return services
    .map((item) => {
      const row = rows.get(item.slug);
      return { ...item, ...(row?.content ?? {}), pdf_url: row?.pdf_url ?? null, is_active: row?.is_active ?? true };
    })
    .filter((item) => item.is_active);
});

export const getPublicService = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const all = await listPublicServices();
    return (all as ManagedService[]).find((item) => item.slug === data.slug) ?? null;
  });

export const listWebsitePortfolio = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { rows } = await pool.query<WebsitePortfolioItem>(
      `SELECT id, title, image_url, alt_text, caption, project_url, is_featured
       FROM gallery_items
       WHERE lower(category) IN ('website development', 'website portfolio')
       ORDER BY is_featured DESC, sort_order ASC, created_at DESC
       LIMIT 12`,
    );
    return rows;
  } catch {
    // Keeps the public service page online until the optional portfolio fields are migrated.
    return [] as WebsitePortfolioItem[];
  }
});

export const listPublicIndustries = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await overrides("industry_pages");
  return industries
    .map((item) => {
      const row = rows.get(item.slug);
      return { ...item, ...(row?.content ?? {}), pdf_url: row?.pdf_url ?? null, is_active: row?.is_active ?? true };
    })
    .filter((item) => item.is_active);
});

export const getPublicIndustry = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const all = await listPublicIndustries();
    return (all as ManagedIndustry[]).find((item) => item.slug === data.slug) ?? null;
  });
