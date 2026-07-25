import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listBlogPosts, upsertBlogPost, deleteBlogPost } from "@/lib/admin.functions";
import { AdminShell } from "@/components/admin-shell";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X, Calendar } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogPage,
});

type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  created_at?: string;
  author?: {
    full_name: string | null;
  } | null;
};

function BlogPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listBlogPosts);
  const upsertFn = useServerFn(upsertBlogPost);
  const deleteFn = useServerFn(deleteBlogPost);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: () => listFn() as Promise<BlogPost[]>,
  });

  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Blog post deleted");
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Blog posts">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Blog posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write articles and news updates for your site.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-3.5 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Add post
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No blog posts yet — write your first article!</div>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                {p.cover_image ? (
                  <img src={p.cover_image} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover bg-muted" />
                ) : (
                  <div className="h-12 w-16 shrink-0 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-brand-navy">{p.title}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <span>By {p.author?.full_name || "Admin"}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Draft"}
                    </span>
                  </div>
                  {p.excerpt && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.excerpt}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditing(p); setShowForm(true); }}
                    className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {p.id && (
                    <button
                      onClick={() => { if (confirm(`Delete "${p.title}"?`)) del.mutate(p.id!); }}
                      className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <BlogForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={async (payload) => {
            try {
              await upsertFn({ data: payload });
              toast.success("Blog post saved");
              qc.invalidateQueries({ queryKey: ["blog-posts"] });
              setShowForm(false);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Save failed");
            }
          }}
        />
      )}
    </AdminShell>
  );
}

function BlogForm({
  initial,
  onClose,
  onSave,
}: {
  initial: BlogPost | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initial?.published_at ? new Date(initial.published_at).toISOString().split("T")[0] : ""
  );
  const [saving, setSaving] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!initial) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      id: initial?.id,
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_image: coverImage || null,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-brand-navy">{initial ? "Edit blog post" : "Add blog post"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Post Title" required>
              <input required value={title} onChange={(e) => handleTitleChange(e.target.value)} className="input" />
            </Field>
            <Field label="Slug (URL key)" required>
              <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Cover image">
            <ImageUpload value={coverImage} onChange={setCoverImage} purpose="blog" />
          </Field>
          <Field label="Publish Date (leave empty for Draft)">
            <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="input" />
          </Field>
          <Field label="Excerpt" required>
            <input required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary for lists" className="input" />
          </Field>
          <Field label="Content (HTML or Markdown supported)" required>
            <textarea required rows={8} value={content} onChange={(e) => setContent(e.target.value)} className="input resize-none" />
          </Field>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
      <style>{`.input{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:0.375rem;padding:0.5rem 0.75rem;font-size:0.875rem;outline:none}.input:focus{border-color:transparent;box-shadow:0 0 0 2px oklch(0.72 0.17 55 / 0.4)}`}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">
        {label}{required && <span className="text-red-600"> *</span>}
      </label>
      {children}
    </div>
  );
}
