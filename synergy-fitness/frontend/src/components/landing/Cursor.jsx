import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const LABELS = { view: "View", book: "Book", join: "Join" };

export const Cursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState({ active: false, kind: null });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e) => {
      const t = e.target.closest("[data-cursor], a, button, input");
      if (!t) {
        setHover({ active: false, kind: null });
        return;
      }
      const kind = t.dataset ? t.dataset.cursor : null;
      setHover({ active: true, kind: kind && LABELS[kind] ? kind : null });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  const label = hover.kind ? LABELS[hover.kind] : null;

  return (
    <>
      <motion.div
        data-testid="custom-cursor-dot"
        aria-hidden="true"
        className="fixed top-0 left-0 z-[120] pointer-events-none w-2 h-2 rounded-full bg-[#F4F4F0] mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        data-testid="custom-cursor-ring"
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[119] pointer-events-none rounded-full flex items-center justify-center ${
          label ? "bg-[#4C63F5]" : "border border-[#F4F4F0]/60 mix-blend-difference"
        }`}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 76 : hover.active ? 56 : 36,
          height: label ? 76 : hover.active ? 56 : 36,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && (
          <span className="font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#F4F4F0]">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
};
