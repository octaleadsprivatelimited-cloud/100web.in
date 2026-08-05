import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getActiveBanner } from "@/lib/admin.functions";

const DISMISS_KEY = "sitePopupDismissedId";

type Banner = {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  position: "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right";
  style_variant: "classic" | "gradient" | "minimal" | "image-focus";
  text_align: "left" | "center" | "right";
};

const positionClasses: Record<Banner["position"], string> = {
  "top-left": "items-start justify-start p-3 sm:p-6",
  "top-center": "items-start justify-center p-3 sm:p-6",
  "top-right": "items-start justify-end p-3 sm:p-6",
  center: "items-center justify-center p-3 sm:p-6",
  "bottom-left": "items-end justify-start p-3 sm:p-6",
  "bottom-center": "items-end justify-center p-3 sm:p-6",
  "bottom-right": "items-end justify-end p-3 sm:p-6",
};

const alignClasses: Record<Banner["text_align"], string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function SitePopupBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [visible, setVisible] = useState(false);
  const loadBanner = useServerFn(getActiveBanner);

  useEffect(() => {
    loadBanner().then((b) => {
        if (!b) return;
        if (sessionStorage.getItem(DISMISS_KEY) === b.id) return;
        setBanner(b as Banner);
        setTimeout(() => setVisible(true), 600);
      });
  }, [loadBanner]);

  function dismiss() {
    if (banner) sessionStorage.setItem(DISMISS_KEY, banner.id);
    setVisible(false);
  }

  if (!banner || !visible) return null;

  const position = banner.position ?? "bottom-right";
  const variant = banner.style_variant ?? "classic";
  const alignment = banner.text_align ?? "left";
  const isGradient = variant === "gradient";
  const isMinimal = variant === "minimal";
  const isImageFocus = variant === "image-focus";

  return (
    <div className={`pointer-events-none fixed inset-0 z-50 flex ${positionClasses[position]}`}>
      <div className={`pointer-events-auto relative w-full overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-300 ${
        isGradient
          ? "max-w-lg rounded-3xl border-transparent bg-gradient-to-br from-brand-navy via-indigo-800 to-violet-600 text-white"
          : isMinimal
            ? "max-w-2xl rounded-xl border-brand-navy/15 bg-background/95 backdrop-blur"
            : isImageFocus
              ? "max-w-xl rounded-3xl border-border bg-background"
              : "max-w-sm rounded-2xl border-border bg-background"
      }`}>
        {banner.image_url && (
          <img
            src={banner.image_url}
            alt=""
            className={`${isMinimal ? "hidden" : "block h-auto max-h-[min(42svh,26rem)] w-full bg-slate-100 object-contain object-center"}`}
          />
        )}
        <button
          onClick={dismiss}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className={`${isMinimal ? "px-5 py-4 sm:px-7" : "p-5 sm:p-6"} ${alignClasses[alignment]}`}>
          <h3 className={`text-base font-semibold sm:text-lg ${isGradient ? "text-white" : "text-brand-navy"}`}>{banner.title}</h3>
          {banner.message && <p className={`mt-1 text-sm ${isGradient ? "text-white/80" : "text-muted-foreground"}`}>{banner.message}</p>}
          {banner.cta_label && banner.cta_url && (
            <a
              href={banner.cta_url}
              className={`mt-3 inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium hover:brightness-110 ${
                isGradient ? "bg-white text-brand-navy" : "bg-brand-navy text-white"
              }`}
            >
              {banner.cta_label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
