import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const quickLinks = [
  { label: "Book A Class", to: "/app/book", note: "This week's timetable" },
  { label: "My Progress", to: "/app/progress", note: "Steps, streaks, SG3" },
  { label: "The Journal", to: "/app/news", note: "News, offers, events" },
  { label: "Refer A Friend", to: "/app/profile", note: "Coming in Phase 4", soon: true },
];

export default function MemberHome() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  const firstName = user?.name?.split(" ")[0] || "Athlete";

  return (
    <div data-testid="member-home" className="px-6 pt-10 pb-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-3">
          {greeting}
        </p>
        <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl">
          {firstName}.
        </h1>
        <p className="mt-4 text-sm text-[#F4F4F0]/55 max-w-xs leading-relaxed">
          Stronger together. Every rep. Here's your Synergy at a glance.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 border-t border-l border-[#F4F4F0]/10">
        {quickLinks.map((q, i) => (
          <motion.div
            key={q.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-r border-[#F4F4F0]/10"
          >
            <Link
              to={q.to}
              data-testid={`quick-${q.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex items-center justify-between p-6 hover:bg-[#1A1A1A] transition-colors duration-300"
            >
              <div>
                <p className="font-display font-semibold uppercase tracking-tight text-xl text-[#F4F4F0] group-hover:text-[#4C63F5] transition-colors duration-300">
                  {q.label}
                </p>
                <p className="mt-1 font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#F4F4F0]/40">
                  {q.note}
                </p>
              </div>
              {q.soon ? (
                <span className="font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#4C63F5] border border-[#4C63F5]/40 px-3 py-1.5">
                  Soon
                </span>
              ) : (
                <ArrowUpRight className="w-5 h-5 text-[#F4F4F0]/40 group-hover:text-[#4C63F5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/30">
        4x UK Functional Gym of the Year
      </p>
    </div>
  );
}
