import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listBanners, upsertBanner, deleteBanner } from "@/lib/admin.functions";
import { AdminShell } from "@/components/admin-shell";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  component: BannersPage,
});

type Banner = {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  priority: number;
  position: BannerPosition;
  style_variant: BannerStyle;
  text_align: BannerAlignment;
};

type BannerPosition = "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right";
type BannerStyle = "classic" | "gradient" | "minimal" | "image-focus";
type BannerAlignment = "left" | "center" | "right";

const bannerPresets: Array<{ name: string; style: BannerStyle; position: BannerPosition; align: BannerAlignment; description: string }> = [
  { name: "Classic", style: "classic", position: "bottom-right", align: "left", description: "Clean card with a strong action button" },
  { name: "Celebration", style: "gradient", position: "top-center", align: "center", description: "Colourful design for offers and launches" },
  { name: "Minimal", style: "minimal", position: "bottom-center", align: "center", description: "Compact announcement with subtle styling" },
  { name: "Image focus", style: "image-focus", position: "center", align: "left", description: "Large visual for campaigns and events" },
];

function BannersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listBanners);
  const upsertFn = useServerFn(upsertBanner);
  const deleteFn = useServerFn(deleteBanner);

  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: () => listFn() as Promise<Banner[]>,
  });

  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Banner deleted");
      qc.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Popup banners">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Popup banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">Site-wide announcements shown as a dismissible popup.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-3.5 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> New banner
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No banners yet — create your first one.</div>
        ) : (
          <ul className="divide-y divide-border">
            {banners.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                {b.image_url ? (
                  <img src={b.image_url} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
                ) : (
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-muted text-xs text-muted-foreground">No img</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-brand-navy">{b.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {b.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{b.message}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditing(b); setShowForm(true); }}
                    className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${b.title}"?`)) del.mutate(b.id); }}
                    className="grid h-8 w-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <BannerForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={async (payload) => {
            try {
              await upsertFn({ data: payload });
              toast.success("Banner saved");
              qc.invalidateQueries({ queryKey: ["banners"] });
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

function BannerForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Banner | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? "");
  const [ctaUrl, setCtaUrl] = useState(initial?.cta_url ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [position, setPosition] = useState<BannerPosition>(initial?.position ?? "bottom-right");
  const [styleVariant, setStyleVariant] = useState<BannerStyle>(initial?.style_variant ?? "classic");
  const [textAlign, setTextAlign] = useState<BannerAlignment>(initial?.text_align ?? "left");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      id: initial?.id,
      title,
      message,
      image_url: imageUrl || null,
      cta_label: ctaLabel || null,
      cta_url: ctaUrl || null,
      is_active: isActive,
      priority: 0,
      position,
      style_variant: styleVariant,
      text_align: textAlign,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-base font-semibold text-brand-navy">{initial ? "Edit banner" : "New banner"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
          <Field label="Title" required>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </Field>
          <Field label="Message">
            <textarea rows={3} value={message ?? ""} onChange={(e) => setMessage(e.target.value)} className="input resize-none" />
          </Field>
          <Field label="Image">
            <ImageUpload value={imageUrl} onChange={setImageUrl} purpose="banner" />
          </Field>
          <Field label="Design model">
            <div className="grid grid-cols-2 gap-2">
              {bannerPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setStyleVariant(preset.style);
                    setPosition(preset.position);
                    setTextAlign(preset.align);
                  }}
                  className={`rounded-lg border p-3 text-left transition ${styleVariant === preset.style ? "border-brand-navy bg-brand-navy/5 ring-1 ring-brand-navy" : "border-border hover:bg-muted"}`}
                >
                  <span className="block text-xs font-semibold text-brand-navy">{preset.name}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">{preset.description}</span>
                </button>
              ))}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Placement">
              <select value={position} onChange={(e) => setPosition(e.target.value as BannerPosition)} className="input">
                <option value="top-left">Top left</option>
                <option value="top-center">Top center</option>
                <option value="top-right">Top right</option>
                <option value="center">Centre screen</option>
                <option value="bottom-left">Bottom left</option>
                <option value="bottom-center">Bottom center</option>
                <option value="bottom-right">Bottom right</option>
              </select>
            </Field>
            <Field label="Content alignment">
              <select value={textAlign} onChange={(e) => setTextAlign(e.target.value as BannerAlignment)} className="input">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA label"><input value={ctaLabel ?? ""} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Learn more" className="input" /></Field>
            <Field label="CTA link"><input value={ctaUrl ?? ""} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/contact" className="input" /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4" />
            Active (show on site)
          </label>
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
