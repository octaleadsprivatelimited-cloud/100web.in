import { useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { services } from "../lib/services-data";
import { industries } from "../lib/industries-data";
import { getDirectoryIndustryPhoto } from "../lib/industry-directory-photos";
import whatsappLogo from "../assets/whatsapp.svg";

const WHATSAPP_NUMBER = "917780273879";

export function PageWhatsAppPrompt() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isOpen, setIsOpen] = useState(false);
  const prompt = useMemo(() => {
    const match = pathname.match(/^\/(services|industries)\/([^/]+)$/);
    if (!match) return null;
    const [, type, slug] = match;

    if (type === "services") {
      const service = services.find((item) => item.slug === slug);
      const name = service?.badge || slug.replaceAll("-", " ");
      return { title: `Ask about ${name}`, image: service?.image, message: `Hello, I need ${name.toLowerCase()} for my business. Please share details.` };
    }

    const industry = industries.find((item) => item.slug === slug);
    const name = industry?.name || slug.replaceAll("-", " ");
    const position = industries.filter((item) => item.category === industry?.category).findIndex((item) => item.slug === slug);
    const image = industry ? getDirectoryIndustryPhoto(industry.category, position) : null;
    return { title: `Ask about ${name}`, image, message: `Hello, I need digital support for my ${name} business. Please share details.` };
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
    if (!prompt) return;
    const timer = window.setTimeout(() => setIsOpen(true), 2200);
    return () => window.clearTimeout(timer);
  }, [pathname, prompt]);

  if (!prompt) return null;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prompt.message)}`;
  const isIndustryPreview = typeof prompt.image === "object";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.97 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed bottom-20 right-3 z-[75] w-[min(16.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.2)] sm:bottom-6 sm:right-6 sm:w-[18rem]"
          aria-label="WhatsApp help"
        >
          <div className="flex items-center justify-between gap-3 bg-[#075E54] px-4 py-3 text-white">
            <div className="min-w-0 flex items-center gap-2"><img src={whatsappLogo} alt="" className="h-5 w-5 shrink-0" /><p className="truncate text-sm font-bold">{prompt.title}</p></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close WhatsApp prompt" className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2.5">
              {prompt.image && <div className={`shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-sm ${isIndustryPreview ? "h-20 w-[3.3125rem]" : "h-20 w-28"}`}>{typeof prompt.image === "string" ? <img src={prompt.image} alt="" className="h-full w-full object-cover object-center" /> : <div role="img" aria-label={`${prompt.title} preview`} className="h-full w-full bg-no-repeat" style={{ backgroundImage: `url(${prompt.image.src})`, backgroundSize: prompt.image.imageSize, backgroundPosition: prompt.image.crop }} />}</div>}
              <p className="min-h-16 flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs leading-4 text-slate-700">{prompt.message}</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-bold text-[#063b2f] transition hover:brightness-95"><Send className="h-4 w-4" /> WhatsApp</a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
