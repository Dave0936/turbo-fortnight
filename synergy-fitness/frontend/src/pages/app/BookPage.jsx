import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const TEAMUP_URL = "https://goteamup.com/p/9619264-synergy-group-fitness/";

const week = [
  { day: "Mon", classes: [{ t: "07:00", n: "SG3" }, { t: "09:00", n: "Open Gym" }, { t: "12:00", n: "SG3" }, { t: "17:50", n: "SG3" }, { t: "18:50", n: "SG3" }] },
  { day: "Tue", classes: [{ t: "06:15", n: "Synergy SWEAT" }, { t: "09:00", n: "Open Gym" }, { t: "12:00", n: "Open Gym" }, { t: "17:00", n: "Open Gym" }, { t: "18:00", n: "Open Gym" }] },
  { day: "Wed", classes: [{ t: "06:15", n: "SG3" }, { t: "07:00", n: "Open Gym" }, { t: "09:00", n: "Open Gym" }, { t: "12:00", n: "SG3" }, { t: "18:00", n: "SG3" }, { t: "19:00", n: "Synergy SWEAT" }] },
  { day: "Thu", classes: [{ t: "06:15", n: "SG3 Strength" }, { t: "09:00", n: "Open Gym" }, { t: "12:00", n: "Open Gym" }, { t: "17:00", n: "Open Gym" }, { t: "18:00", n: "SG3 CV" }, { t: "19:00", n: "SG3 Strength" }] },
  { day: "Fri", classes: [], note: "Rest & Recovery" },
  { day: "Sat", classes: [{ t: "08:00", n: "SG3" }, { t: "09:00", n: "SG3" }] },
  { day: "Sun", classes: [{ t: "09:00", n: "SG3" }] },
];

export default function BookPage() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "short" });

  return (
    <div data-testid="book-page" className="px-6 pt-10 pb-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-3">Book</p>
        <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl mb-4">
          This Week.
        </h1>
        <p className="text-sm text-[#F4F4F0]/55 leading-relaxed max-w-sm">
          Booking opens in the Synergy member portal. Fully booked? Join the
          reserve list — it almost always clears.
        </p>
      </motion.div>

      <div className="mt-8 space-y-px">
        {week.map((d, i) => (
          <motion.div
            key={d.day}
            data-testid={`book-day-${d.day.toLowerCase()}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className={`border border-[#F4F4F0]/10 p-5 ${d.day === today ? "border-l-2 border-l-[#4C63F5]" : ""}`}
          >
            <div className="flex items-baseline justify-between mb-3">
              <span className={`font-display font-bold uppercase tracking-tight text-xl ${d.day === today ? "text-[#4C63F5]" : "text-[#F4F4F0]"}`}>
                {d.day}
              </span>
              {d.day === today && (
                <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#4C63F5]">Today</span>
              )}
            </div>
            {d.note && (
              <p className="font-mono-accent text-[11px] tracking-[0.2em] uppercase text-[#F4F4F0]/35">{d.note}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {d.classes.map((c, j) => (
                <a
                  key={j}
                  data-testid={`book-class-${d.day.toLowerCase()}-${j}`}
                  href={TEAMUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 border border-[#F4F4F0]/15 hover:border-[#4C63F5] px-3.5 py-2.5 transition-colors duration-300"
                >
                  <span className="font-mono-accent text-[10px] text-[#F4F4F0]/45">{c.t}</span>
                  <span className={`font-display uppercase tracking-wide text-sm ${c.n.startsWith("SG3") ? "text-[#4C63F5]" : "text-[#F4F4F0]"}`}>
                    {c.n}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F4F4F0]/30 group-hover:text-[#4C63F5] transition-colors duration-300" />
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
