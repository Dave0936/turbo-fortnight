import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, TrendingUp } from "lucide-react";

export const ProgramModal = ({ program, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    if (program) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [onClose, program]);

  return (
    <AnimatePresence>
      {program && (
        <motion.div
          data-testid="program-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[80] bg-[#121212] overflow-y-auto"
        >
          <button
            data-testid="program-modal-close"
            onClick={onClose}
            aria-label="Close program details"
            className="fixed top-5 right-6 md:right-12 z-10 flex items-center gap-2 font-mono-accent text-xs tracking-[0.25em] uppercase text-[#F4F4F0]/70 hover:text-[#4C63F5] transition-colors duration-300 p-2"
          >
            Close <X className="w-5 h-5" />
          </button>

          <div className="min-h-full grid grid-cols-12">
            <div className="col-span-12 md:col-span-5 flex flex-col justify-between px-6 md:px-12 pt-28 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
                  Program /{program.num}
                </p>
                <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-7xl md:text-8xl">
                  {program.name}
                </h2>
                <p className="font-mono-accent text-xs tracking-[0.25em] uppercase text-[#F4F4F0]/50 mt-4">
                  {program.tag}
                </p>
                <p className="mt-8 text-base md:text-lg leading-relaxed text-[#F4F4F0]/75 max-w-md">
                  {program.detail}
                </p>
                <a
                  data-testid="program-modal-book-button"
                  data-cursor="book"
                  href="#join"
                  onClick={onClose}
                  className="mt-10 inline-flex items-center gap-3 bg-[#4C63F5] hover:bg-[#3b4ce0] text-[#F4F4F0] font-display uppercase tracking-wide text-base px-10 py-5 transition-colors duration-300"
                >
                  Book A Free Trial
                </a>
              </motion.div>

              <div className="mt-16 border-t border-[#F4F4F0]/10 pt-8">
                <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-3">
                  Led By
                </p>
                <p data-testid="program-modal-coach" className="font-display font-semibold uppercase tracking-tight text-2xl text-[#F4F4F0]">
                  {program.coach.name}
                </p>
                <p className="text-sm text-[#F4F4F0]/60 mt-1 max-w-sm leading-relaxed">
                  {program.coach.bio}
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 md:col-span-7 border-t md:border-t-0 md:border-l border-[#F4F4F0]/10 px-6 md:px-12 py-16 md:pt-28"
            >
              <div className="grid grid-cols-3 border border-[#F4F4F0]/10 mb-14">
                {[
                  { icon: Clock, label: "Duration", value: program.stats.duration },
                  { icon: Users, label: "Capacity", value: program.stats.capacity },
                  { icon: TrendingUp, label: "Intensity", value: program.stats.intensity },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    data-testid={`program-stat-${s.label.toLowerCase()}`}
                    className={`px-4 md:px-6 py-6 ${i > 0 ? "border-l border-[#F4F4F0]/10" : ""}`}
                  >
                    <s.icon className="w-4 h-4 text-[#4C63F5] mb-3" />
                    <p className="font-display font-semibold uppercase text-lg md:text-xl text-[#F4F4F0]">
                      {s.value}
                    </p>
                    <p className="font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#F4F4F0]/40 mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-6">
                A Sample Session
              </p>
              <div className="border-t border-[#F4F4F0]/10 mb-14">
                {program.session.map((s, i) => (
                  <div
                    key={s.step}
                    data-testid={`program-session-step-${i}`}
                    className="grid grid-cols-12 gap-4 items-baseline py-5 border-b border-[#F4F4F0]/10"
                  >
                    <span className="col-span-2 font-mono-accent text-xs text-[#4C63F5]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="col-span-6 font-display font-semibold uppercase tracking-wide text-xl text-[#F4F4F0]">
                      {s.step}
                    </span>
                    <span className="col-span-4 text-right font-mono-accent text-xs text-[#F4F4F0]/50">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>

              <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-6">
                What Changes
              </p>
              <ul className="space-y-4">
                {program.results.map((r, i) => (
                  <li key={r} data-testid={`program-result-${i}`} className="flex items-start gap-4 text-base text-[#F4F4F0]/75">
                    <span className="font-mono-accent text-xs text-[#4C63F5] mt-1">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
