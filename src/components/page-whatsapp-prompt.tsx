import { useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { services } from "../lib/services-data";
import { industries } from "../lib/industries-data";
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
      return { title: `Need ${name}?`, message: `Hello 100 Web Technologies, I need ${name.toLowerCase()} for my business. Please share the next steps, timeline and a suitable quote.` };
    }

    const industry = industries.find((item) => item.slug === slug);
    const name = industry?.name || slug.replaceAll("-", " ");
    return { title: `Growing a ${name} business?`, message: `Hello 100 Web Technologies, I need digital growth support for my ${name} business. Please share the best solution and next steps.` };
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
    if (!prompt) return;
    const timer = window.setTimeout(() => setIsOpen(true), 2200);
    return () => window.clearTimeout(timer);
  }, [pathname, prompt]);

  if (!prompt) return null;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prompt.message)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.97 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed bottom-16 right-4 z-[75] w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.2)] sm:bottom-6 sm:right-6"
          aria-label="WhatsApp help"
        >
          <div className="flex items-center justify-between gap-3 bg-[#075E54] px-4 py-3 text-white">
            <div className="flex items-center gap-2"><img src={whatsappLogo} alt="" className="h-6 w-6" /><p className="text-sm font-bold">{prompt.title}</p></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close WhatsApp prompt" className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-3.5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Your prefilled message</p>
            <p className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm leading-5 text-slate-700">{prompt.message}</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-bold text-[#063b2f] transition hover:brightness-95"><Send className="h-4 w-4" /> Chat on WhatsApp</a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
