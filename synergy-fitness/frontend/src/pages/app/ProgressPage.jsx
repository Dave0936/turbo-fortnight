import { motion } from "framer-motion";
import { Footprints, Flame, Route, CalendarCheck, Watch } from "lucide-react";

const stats = [
  { icon: Footprints, label: "Steps Today", value: "—" },
  { icon: Route, label: "Distance", value: "—" },
  { icon: Flame, label: "Calories", value: "—" },
  { icon: CalendarCheck, label: "Class Streak", value: "0" },
];

export default function ProgressPage() {
  return (
    <div data-testid="progress-page" className="px-6 pt-10 pb-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-3">My Progress</p>
        <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl mb-4">
          The Numbers.
        </h1>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 border-t border-l border-[#F4F4F0]/10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            data-testid={`progress-stat-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-r border-[#F4F4F0]/10 p-6"
          >
            <s.icon className="w-4 h-4 text-[#4C63F5] mb-4" />
            <p className="font-display font-bold text-5xl tracking-tight text-[#F4F4F0]">{s.value}</p>
            <p className="mt-2 font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#F4F4F0]/40">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 border border-[#4C63F5]/40 p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Watch className="w-5 h-5 text-[#4C63F5]" />
          <p className="font-display font-semibold uppercase tracking-wide text-lg text-[#F4F4F0]">
            Apple Health & Wearables
          </p>
        </div>
        <p className="text-sm text-[#F4F4F0]/60 leading-relaxed">
          In the native Synergy app, HealthKit imports your daily steps,
          distance, and calories — plus data from your watch and other
          wearables — straight into this page. That's Phase 3 of the app build.
        </p>
      </motion.div>
    </div>
  );
}
