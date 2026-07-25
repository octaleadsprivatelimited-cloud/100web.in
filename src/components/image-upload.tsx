import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/media.functions";

export function ImageUpload({ value, onChange, purpose }: { value?: string | null; onChange: (url: string) => void; purpose: "banner" | "team" | "gallery" | "blog" | "general" }) {
  const upload = useServerFn(uploadImage);
  const [busy, setBusy] = useState(false);
  async function choose(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    if (file.size > 12 * 1024 * 1024) return toast.error("Image must be smaller than 12 MB");
    setBusy(true);
    try {
      const base64 = await fileBase64(file);
      const result = await upload({ data: { filename: file.name, mimeType: file.type || "image/jpeg", base64, purpose } });
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return <div className="space-y-3">
    {value && <div className="relative w-fit"><img src={value} alt="Selected" className="h-28 w-40 rounded-lg border bg-muted object-cover" /><button type="button" onClick={() => onChange("")} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-red-600 shadow" aria-label="Remove image"><Trash2 className="h-3.5 w-3.5" /></button></div>}
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-xs font-semibold text-brand-navy hover:bg-muted/40">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      {busy ? "Uploading..." : value ? "Replace image" : "Upload image"}
      <input disabled={busy} type="file" accept="image/*,.heic,.heif" onChange={(e) => { choose(e.target.files?.[0]); e.currentTarget.value = ""; }} className="sr-only" />
    </label>
    <div className="flex items-center gap-2"><span className="h-px flex-1 bg-border" /><span className="text-[10px] uppercase text-muted-foreground">or use a link</span><span className="h-px flex-1 bg-border" /></div>
    <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30" />
    <p className="text-[10px] text-muted-foreground">JPEG, PNG, WebP, GIF, AVIF, SVG and other browser-supported image formats · maximum 12 MB.</p>
  </div>;
}

function fileBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this image"));
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.readAsDataURL(file);
  });
}
