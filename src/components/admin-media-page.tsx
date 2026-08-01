import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Images, Loader2, Pencil, Plus, Search, Trash2, X, Youtube } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteGalleryItem,
  deleteVideo,
  listGalleryItems,
  listVideos,
  upsertGalleryItem,
  upsertVideo,
} from "@/lib/admin.functions";
import { ImageUpload } from "@/components/image-upload";

type Mode = "gallery" | "videos";
type RecordRow = {
  id?: string;
  title: string;
  category: string;
  image_url?: string;
  alt_text?: string;
  caption?: string | null;
  project_url?: string | null;
  is_featured?: boolean;
  youtube_url?: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
  sort_order?: number;
};

export function AdminMediaPage({ mode }: { mode: Mode }) {
  const gallery = mode === "gallery";
  const qc = useQueryClient();
  const listGallery = useServerFn(listGalleryItems);
  const listYoutube = useServerFn(listVideos);
  const saveGallery = useServerFn(upsertGalleryItem);
  const saveYoutube = useServerFn(upsertVideo);
  const removeGallery = useServerFn(deleteGalleryItem);
  const removeYoutube = useServerFn(deleteVideo);
  const key = gallery ? "gallery-items" : "youtube-videos";
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<RecordRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const result = useQuery<RecordRow[]>({
    queryKey: [key],
    queryFn: () => (gallery ? listGallery() : listYoutube()) as Promise<RecordRow[]>,
  });

  const remove = useMutation({
    mutationFn: (id: string) => gallery ? removeGallery({ data: { id } }) : removeYoutube({ data: { id } }),
    onSuccess: () => {
      toast.success(gallery ? "Image removed" : "Video removed");
      qc.invalidateQueries({ queryKey: [key] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const rows = (result.data ?? []).filter((row) =>
    `${row.title} ${row.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const Icon = gallery ? Images : Youtube;
  const singular = gallery ? "image" : "video";

  return (
    <AdminShell title={gallery ? "Gallery" : "YouTube videos"}>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            <Icon className="h-3.5 w-3.5" /> Content library
          </div>
          <h1 className="text-2xl font-semibold text-brand-navy">{gallery ? "Gallery images" : "YouTube videos"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {gallery ? "Add portfolio websites with the category “Website Development” to show them on the public service page." : "Publish and arrange videos shown across the website."}
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-navy/90"
        >
          <Plus className="h-4 w-4" /> Add {singular}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${gallery ? "images" : "videos"}...`}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
          </div>
          <span className="text-xs text-muted-foreground">{rows.length} {rows.length === 1 ? "item" : "items"}</span>
        </div>

        {result.isLoading ? (
          <div className="grid min-h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand-orange" /></div>
        ) : rows.length === 0 ? (
          <div className="grid min-h-64 place-items-center p-8 text-center">
            <div>
              <Icon className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="font-medium text-brand-navy">No {gallery ? "images" : "videos"} found</p>
              <p className="mt-1 text-sm text-muted-foreground">Add your first {singular} to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => {
              const preview = gallery ? row.image_url : row.thumbnail_url || youtubeThumbnail(row.youtube_url || "");
              return (
                <article key={row.id} className="group overflow-hidden rounded-xl border border-border bg-background">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {preview ? <img src={preview} alt={row.alt_text || row.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : <Icon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />}
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">{row.category}</span>
                    {(row.is_featured || row.is_published === false) && (
                      <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-semibold text-brand-navy">
                        {row.is_featured ? "Featured" : "Draft"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold text-brand-navy">{row.title}</h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{gallery ? row.caption || row.alt_text : row.description || row.youtube_url}</p>
                    </div>
                    <button onClick={() => { setEditing(row); setFormOpen(true); }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted" aria-label={`Edit ${row.title}`}><Pencil className="h-4 w-4" /></button>
                    <button
                      onClick={() => { if (confirm(`Delete "${row.title}"?`)) remove.mutate(row.id!); }}
                      className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${row.title}`}
                    ><Trash2 className="h-4 w-4" /></button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {formOpen && (
        <MediaForm
          mode={mode}
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={async (payload) => {
            try {
              if (gallery) await saveGallery({ data: payload as any });
              else await saveYoutube({ data: payload as any });
              toast.success(`${gallery ? "Image" : "Video"} saved`);
              qc.invalidateQueries({ queryKey: [key] });
              setFormOpen(false);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Save failed");
            }
          }}
        />
      )}
    </AdminShell>
  );
}

function MediaForm({ mode, initial, onClose, onSave }: { mode: Mode; initial: RecordRow | null; onClose: () => void; onSave: (data: RecordRow) => Promise<void> }) {
  const gallery = mode === "gallery";
  const [data, setData] = useState<RecordRow>(initial ?? {
    title: "", category: "General", sort_order: 0,
    ...(gallery ? { image_url: "", alt_text: "", caption: "", project_url: "", is_featured: false } : { youtube_url: "", thumbnail_url: "", description: "", is_published: true }),
  });
  const [saving, setSaving] = useState(false);
  const update = (name: keyof RecordRow, value: unknown) => setData((current) => ({ ...current, [name]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(data); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-t-2xl bg-background shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold text-brand-navy">{initial ? "Edit" : "Add"} {gallery ? "gallery image" : "YouTube video"}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Fields marked with * are required.</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="max-h-[76vh] space-y-4 overflow-y-auto p-5">
          <Field label="Title *"><input required value={data.title} onChange={(e) => update("title", e.target.value)} className="admin-input" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category *"><input required value={data.category} onChange={(e) => update("category", e.target.value)} className="admin-input" /></Field>
            <Field label="Sort order"><input type="number" value={data.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} className="admin-input" /></Field>
          </div>
          {gallery ? (
            <>
              <Field label="Gallery image *"><ImageUpload value={data.image_url} onChange={(value) => update("image_url", value)} purpose="gallery" /></Field>
              <Field label="Alternative text *"><input required value={data.alt_text} onChange={(e) => update("alt_text", e.target.value)} placeholder="Describe the image for accessibility" className="admin-input" /></Field>
              <Field label="Caption"><textarea rows={3} value={data.caption ?? ""} onChange={(e) => update("caption", e.target.value)} className="admin-input resize-none" /></Field>
              <Field label="Live website URL"><input type="url" value={data.project_url ?? ""} onChange={(e) => update("project_url", e.target.value)} placeholder="https://example.com" className="admin-input" /><span className="mt-1 block text-[10px] text-muted-foreground">Use category “Website Development” to show this project on that service page.</span></Field>
              <Toggle checked={Boolean(data.is_featured)} onChange={(v) => update("is_featured", v)} label="Feature this image" />
            </>
          ) : (
            <>
              <Field label="YouTube URL *"><input required type="url" value={data.youtube_url} onChange={(e) => update("youtube_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." className="admin-input" /></Field>
              <Field label="Custom thumbnail"><ImageUpload value={data.thumbnail_url} onChange={(value) => update("thumbnail_url", value)} purpose="general" /></Field>
              <Field label="Description"><textarea rows={4} value={data.description ?? ""} onChange={(e) => update("description", e.target.value)} className="admin-input resize-none" /></Field>
              <Toggle checked={data.is_published !== false} onChange={(v) => update("is_published", v)} label="Published on website" />
            </>
          )}
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
          </div>
        </form>
      </div>
      <style>{`.admin-input{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:.5rem;padding:.6rem .75rem;font-size:.875rem;outline:none}.admin-input:focus{border-color:transparent;box-shadow:0 0 0 2px oklch(.72 .17 55 / .35)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-foreground">{label}</span>{children}</label>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3">
      <span className="text-sm font-medium">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--brand-orange))]" />
    </label>
  );
}

function youtubeThumbnail(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}
