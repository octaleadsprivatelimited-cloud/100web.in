import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, FileText, Loader2, Pencil, Search, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "./admin-shell";
import { listManagedPages, saveManagedPage } from "@/lib/admin.functions";

type Kind = "service" | "industry";
type PageItem = {
  slug: string;
  title?: string;
  name?: string;
  badge?: string;
  category?: string;
  desc?: string;
  tagline?: string;
  overview?: string;
  description?: string;
  hero_title?: string;
  image?: string;
  image_url?: string;
  pdf_url?: string;
  is_active: boolean;
  [key: string]: unknown;
};

export function AdminManagedPages({ kind }: { kind: Kind }) {
  const plural = kind === "service" ? "Services" : "Industries";
  const listFn = useServerFn(listManagedPages);
  const saveFn = useServerFn(saveManagedPage);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<PageItem | null>(null);
  const queryKey = ["managed-pages", kind];
  const { data = [], isLoading } = useQuery<PageItem[]>({
    queryKey,
    queryFn: () => listFn({ data: { kind } }) as Promise<PageItem[]>,
  });
  const save = useMutation({
    mutationFn: (item: PageItem) => {
      const { id: _id, pdf_url, is_active, ...content } = item;
      return saveFn({ data: { kind, slug: item.slug, content, pdf_url: pdf_url || "", is_active } });
    },
    onSuccess: () => {
      toast.success(`${kind === "service" ? "Service" : "Industry"} page updated`);
      qc.invalidateQueries({ queryKey });
      setEditing(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const filtered = data.filter((item) =>
    `${item.title ?? ""} ${item.name ?? ""} ${item.slug} ${item.category ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title={plural}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-navy">{plural}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edit public page content, visibility, images and downloadable PDF links.</p>
      </div>
      <label className="mb-5 flex max-w-md items-center gap-2 rounded-lg border bg-background px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${plural.toLowerCase()}`} className="w-full bg-transparent py-2.5 text-sm outline-none" />
      </label>
      <div className="overflow-hidden rounded-xl border bg-background">
        {isLoading ? <div className="grid place-items-center py-16"><Loader2 className="h-5 w-5 animate-spin" /></div> : (
          <ul className="divide-y">
            {filtered.map((item) => (
              <li key={item.slug} className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-brand-navy">{item.title ?? item.name}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{item.is_active ? "Published" : "Hidden"}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">/{kind === "service" ? "services" : "industries"}/{item.slug}{item.pdf_url ? " · PDF linked" : ""}</p>
                </div>
                <a href={`/${kind === "service" ? "services" : "industries"}/${item.slug}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-md border" aria-label="View page"><ExternalLink className="h-4 w-4" /></a>
                <button onClick={() => setEditing(item)} className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-3 py-2 text-sm font-medium text-white"><Pencil className="h-4 w-4" /> Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {editing && <PageEditor kind={kind} initial={editing} saving={save.isPending} onClose={() => setEditing(null)} onSave={(item) => save.mutate(item)} />}
    </AdminShell>
  );
}

function PageEditor({ kind, initial, saving, onClose, onSave }: { kind: Kind; initial: PageItem; saving: boolean; onClose: () => void; onSave: (item: PageItem) => void }) {
  const [item, setItem] = useState(initial);
  const set = (key: string, value: unknown) => setItem((current) => ({ ...current, [key]: value }));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-t-2xl bg-background shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div><h2 className="font-semibold text-brand-navy">Edit {kind} page</h2><p className="text-xs text-muted-foreground">/{kind === "service" ? "services" : "industries"}/{item.slug}</p></div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(item); }} className="max-h-[78vh] space-y-4 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={kind === "service" ? "Page title" : "Industry name"}><input required value={(kind === "service" ? item.title : item.name) as string} onChange={(e) => set(kind === "service" ? "title" : "name", e.target.value)} className="managed-input" /></Field>
            <Field label={kind === "service" ? "Badge" : "Category"}><input required value={(kind === "service" ? item.badge : item.category) as string} onChange={(e) => set(kind === "service" ? "badge" : "category", e.target.value)} className="managed-input" /></Field>
          </div>
          {kind === "service" ? <>
            <Field label="Card description"><textarea rows={2} value={(item.desc ?? "") as string} onChange={(e) => set("desc", e.target.value)} className="managed-input" /></Field>
            <Field label="Hero tagline"><input value={(item.tagline ?? "") as string} onChange={(e) => set("tagline", e.target.value)} className="managed-input" /></Field>
            <Field label="Page overview"><textarea rows={5} value={(item.overview ?? "") as string} onChange={(e) => set("overview", e.target.value)} className="managed-input" /></Field>
            <Field label="Hero image URL"><input value={(item.image ?? "") as string} onChange={(e) => set("image", e.target.value)} className="managed-input" /></Field>
          </> : <>
            <Field label="Hero heading (optional)"><input value={(item.hero_title ?? "") as string} onChange={(e) => set("hero_title", e.target.value)} placeholder={`Grow your ${item.name} business online`} className="managed-input" /></Field>
            <Field label="Page description"><textarea rows={5} value={(item.description ?? "") as string} onChange={(e) => set("description", e.target.value)} className="managed-input" /></Field>
            <Field label="Hero image URL (optional)"><input value={(item.image_url ?? "") as string} onChange={(e) => set("image_url", e.target.value)} className="managed-input" /></Field>
          </>}
          <Field label="PDF link"><div className="relative"><FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input type="url" value={item.pdf_url ?? ""} onChange={(e) => set("pdf_url", e.target.value)} placeholder="https://example.com/brochure.pdf" className="managed-input pl-9" /></div></Field>
          <label className="flex items-center gap-3 rounded-lg border p-3 text-sm"><input type="checkbox" checked={item.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Publish this page on the website</label>
          <div className="flex justify-end gap-2 border-t pt-4"><button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</button></div>
        </form>
      </div>
      <style>{`.managed-input{width:100%;border:1px solid hsl(var(--border));border-radius:.375rem;background:hsl(var(--background));padding:.55rem .75rem;font-size:.875rem;outline:none}.managed-input:focus{box-shadow:0 0 0 2px oklch(.72 .17 55/.35);border-color:transparent}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium">{label}</span>{children}</label>;
}
