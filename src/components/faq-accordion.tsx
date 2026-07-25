import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type FaqItemData = { q: string; a: string };

export function FaqAccordion({ items, defaultOpenIndex = 0 }: { items: FaqItemData[]; defaultOpenIndex?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpenIndex);
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-brand-navy/10 bg-white/70 backdrop-blur sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-brand-navy sm:px-5 sm:py-4"
            >
              <span className="text-[13.5px] font-semibold leading-snug sm:text-base">{f.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="shrink-0"
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-brand-navy/10 px-4 py-3.5 text-[13px] leading-relaxed text-brand-navy/80 sm:px-5 sm:py-4 sm:text-sm">
                    {f.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}