import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 2000;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        setTimeout(onComplete, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      data-testid="preloader"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#121212] flex flex-col justify-between px-6 md:px-12 py-8"
    >
      <div className="flex items-center justify-between">
        <img
          src="/synergy-logo.png"
          alt="Synergy Group Fitness"
          className="h-7 w-auto"
        />
        <span className="font-mono-accent text-[10px] tracking-[0.3em] uppercase text-[#F4F4F0]/40">
          Loading Experience
        </span>
      </div>

      <div className="overflow-hidden self-center">
        <motion.p
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl text-outline whitespace-nowrap"
        >
          Stronger Together. Every Rep.
        </motion.p>
      </div>

      <div className="flex items-end justify-between gap-8">
        <div className="flex-1 mb-6">
          <div className="h-px bg-[#F4F4F0]/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#4C63F5]"
              style={{ width: `${count}%` }}
            />
          </div>
        </div>
        <span
          data-testid="preloader-count"
          className="font-display font-bold leading-none tracking-tight text-[#F4F4F0] text-8xl md:text-[10rem] tabular-nums"
        >
          {count}
          <span className="text-[#4C63F5] text-4xl md:text-6xl align-top">%</span>
        </span>
      </div>
    </motion.div>
  );
};
