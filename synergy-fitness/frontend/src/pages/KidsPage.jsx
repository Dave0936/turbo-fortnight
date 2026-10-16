import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Shield, Heart, Zap } from "lucide-react";
import { PageHeader } from "@/components/landing/PageHeader";
import { CTA } from "@/components/landing/CTA";

const IMG_KIDS_TRX =
  "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/vn5zk356_S1040412.webp";
const IMG_KIDS_ROW =
  "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/lz254m8q_S1040674.webp";

const pillars = [
  {
    icon: Shield,
    title: "Safe & Supported",
    body: "Every session is fully coached with age-appropriate loading and movement. Nobody is thrown in at the deep end — technique first, always.",
  },
  {
    icon: Heart,
    title: "Confidence First",
    body: "The goal isn't just fitness. It's kids who walk taller, try new things, and learn that their body is something to be proud of.",
  },
  {
    icon: Zap,
    title: "Genuinely Fun",
    body: "Creative games, challenges, and teamwork — the same inventive programming Synergy is known for, tuned for younger athletes.",
  },
];

export default function KidsPage() {
  return (
    <>
      <PageHeader
        kicker="Teen & Kids Fitness"
        title={"Strong Starts\nHere."}
        sub="Confidence-building sessions for younger athletes — safe, structured, and genuinely fun. The same award-winning coaching, scaled for the next generation."
      />

      <section data-testid="kids-intro" className="px-6 md:px-12 pb-24 grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-7 group relative overflow-hidden aspect-[4/3]">
          <img
            src={IMG_KIDS_ROW}
            alt="A young member learning to row with a Synergy coach beside her"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-[#4C63F5]/20 mix-blend-color group-hover:opacity-0 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/50 via-transparent to-transparent" />
          <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
          <span className="absolute bottom-4 left-5 font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/80">
            Every Level Welcome
          </span>
        </div>
        <div className="col-span-10 col-start-2 md:col-span-4 md:col-start-9 md:-mt-16 group relative overflow-hidden aspect-[3/4]">
          <img
            src={IMG_KIDS_TRX}
            alt="A teen member training on suspension straps with a big smile"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-[#4C63F5]/20 mix-blend-color group-hover:opacity-0 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/50 via-transparent to-transparent" />
          <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
          <span className="absolute bottom-4 left-5 font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/80">
            The Next Generation
          </span>
        </div>
      </section>

      <section data-testid="kids-pillars" className="px-6 md:px-12 py-24 md:py-32 bg-[#EDE8DF]">
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-12">
          What Parents Can Expect
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#121212]/15">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              data-testid={`kids-pillar-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-r border-[#121212]/15 p-8 md:p-12"
            >
              <p.icon className="w-6 h-6 text-[#4C63F5]" />
              <h3 className="mt-6 font-display font-semibold uppercase tracking-tight text-2xl text-[#121212]">
                {p.title}
              </h3>
              <p className="mt-4 text-sm md:text-base text-[#121212]/65 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            data-testid="kids-enquire-button"
            to="/contact"
            className="group inline-flex items-center gap-3 bg-[#4C63F5] hover:bg-[#3b4ce0] text-[#F4F4F0] font-display uppercase tracking-wide text-base px-10 py-5 transition-colors duration-300"
          >
            Ask About Kids Sessions
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
      <CTA />
    </>
  );
}
