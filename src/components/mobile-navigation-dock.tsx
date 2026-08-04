import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

export type MobileDockItem = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
};

type MobileNavigationDockProps = {
  items: MobileDockItem[];
};

export function MobileNavigationDock({ items }: MobileNavigationDockProps) {
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <nav
      className="fixed inset-x-0 bottom-2 z-[70] mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-0.5 rounded-xl border border-slate-200/80 bg-white/95 p-1 shadow-[0_10px_24px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:hidden"
      aria-label="Mobile quick navigation"
      onPointerMove={(event) => pointerX.set(event.clientX)}
      onPointerLeave={() => pointerX.set(Number.POSITIVE_INFINITY)}
    >
      {items.map((item) => (
        <MobileDockButton key={item.label} item={item} pointerX={pointerX} />
      ))}
    </nav>
  );
}

function MobileDockButton({ item, pointerX }: { item: MobileDockItem; pointerX: MotionValue<number> }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const distance = useTransform(pointerX, (value) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    return rect ? value - rect.left - rect.width / 2 : 0;
  });
  const scale = useSpring(useTransform(distance, [-100, 0, 100], [1, 1.12, 1]), { mass: 0.15, stiffness: 240, damping: 18 });

  return (
    <motion.button
      type="button"
      ref={buttonRef}
      onClick={item.onClick}
      style={{ scale }}
      whileTap={{ scale: 0.92 }}
      className={`grid h-9 w-9 place-items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 ${item.active ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-slate-100"}`}
      aria-label={item.label}
      title={item.label}
    >
      <span className="grid h-[18px] w-[18px] place-items-center [&>img]:h-full [&>img]:w-full [&>img]:object-contain [&>svg]:h-full [&>svg]:w-full">
        {item.icon}
      </span>
    </motion.button>
  );
}
