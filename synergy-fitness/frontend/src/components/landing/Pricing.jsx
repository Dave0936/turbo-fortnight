import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free Trial",
    price: "0",
    per: "7 days",
    desc: "For new customers. Full access, no card required.",
    features: ["1-week free group fitness membership", "Unlimited classes during trial", "Coached from your very first session", "Book everything in the Synergy app"],
    featured: false,
  },
  {
    name: "Synergy Plus",
    price: "88",
    per: "/mo",
    desc: "The full Synergy experience, rolling monthly.",
    features: ["Full access to the group fitness timetable", "Open gym slots included", "MySynergyCoach app access", "SG3 fat-loss & performance nutrition programme", "Rolling monthly — no long-term commitment"],
    featured: true,
  },
  {
    name: "PAYG & Passes",
    price: "8",
    per: "/day",
    desc: "Train on your terms, no membership needed.",
    features: ["Pay-as-you-go single class booking", "10 Class Pass — discounted, never expires", "Hussle Day Pass from £8", "Hussle monthly from ~£42", "Best under 1.5 sessions per week"],
    featured: false,
  },
];

export const Pricing = () => {
  return (
    <section id="membership" data-testid="membership-section" className="bg-[#EDE8DF] py-32 md:py-40">
      <div className="px-6 md:px-12 mb-20">
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
          Membership
        </p>
        <h2 className="font-display font-bold uppercase tracking-tight text-4xl md:text-6xl text-[#121212]">
          Choose Your Commitment
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-[#121212]/60">
          Rolling monthly. No joining fee. No 12-month contracts — one month's
          notice is all we ever ask.
        </p>
      </div>

      <div className="mx-6 md:mx-12 border border-[#121212]/15 grid grid-cols-1 md:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            data-testid={`pricing-tier-${t.name.toLowerCase().replace(/[^a-z]/g, "-")}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative p-8 md:p-12 flex flex-col ${
              i > 0 ? "border-t md:border-t-0 md:border-l border-[#121212]/15" : ""
            } ${t.featured ? "bg-[#4C63F5]" : "bg-transparent"}`}
          >
            {t.featured && (
              <span className="absolute top-0 right-0 font-mono-accent text-[10px] tracking-[0.25em] uppercase bg-[#121212] text-[#F4F4F0] px-4 py-2">
                Most Chosen
              </span>
            )}
            <h3 className={`font-display font-semibold uppercase tracking-tight text-2xl ${t.featured ? "text-[#F4F4F0]" : "text-[#121212]"}`}>
              {t.name}
            </h3>
            <p className={`text-sm mt-1 ${t.featured ? "text-[#F4F4F0]/80" : "text-[#121212]/55"}`}>{t.desc}</p>
            <p className="mt-8 flex items-start gap-1">
              <span className={`font-mono-accent text-lg mt-2 ${t.featured ? "text-[#F4F4F0]/80" : "text-[#121212]/50"}`}>£</span>
              <span className={`font-display font-bold text-7xl md:text-8xl tracking-tight leading-none ${t.featured ? "text-[#F4F4F0]" : "text-[#121212]"}`}>
                {t.price}
              </span>
              <span className={`font-mono-accent text-xs mt-auto mb-1 ${t.featured ? "text-[#F4F4F0]/80" : "text-[#121212]/50"}`}>{t.per}</span>
            </p>
            <ul className="mt-10 space-y-4 flex-1">
              {t.features.map((f) => (
                <li key={f} className={`flex items-start gap-3 text-sm ${t.featured ? "text-[#F4F4F0]" : "text-[#121212]/75"}`}>
                  <Check className={`w-4 h-4 mt-0.5 shrink-0 ${t.featured ? "text-[#F4F4F0]" : "text-[#4C63F5]"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#join"
              data-testid={`pricing-cta-${i}`}
              className={`mt-10 text-center font-display uppercase tracking-wide text-sm px-8 py-4 transition-colors duration-300 ${
                t.featured
                  ? "bg-[#121212] text-[#F4F4F0] hover:bg-[#1A1A1A]"
                  : "border border-[#121212]/25 text-[#121212] hover:border-[#4C63F5] hover:text-[#4C63F5]"
              }`}
            >
              {t.name === "Free Trial" ? "Claim Free Week" : `Select ${t.name}`}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
