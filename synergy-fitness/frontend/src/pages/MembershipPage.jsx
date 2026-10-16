import { motion } from "framer-motion";
import { PageHeader } from "@/components/landing/PageHeader";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";

const promises = [
  {
    title: "No Joining Fee",
    body: "After 18 years in the industry, we still don't know how other gyms justify one. So there isn't one.",
  },
  {
    title: "No 12-Month Contracts",
    body: "If you want to train with us, great. If not, we won't hold you to ransom — one month's notice is all we ask.",
  },
  {
    title: "PAYG Welcome",
    body: "Not ready to commit? Train pay-as-you-go or with a 10-class pass. Membership just works out cheaper past 1.5 classes a week.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        kicker="Membership"
        title={"Choose Your\nCommitment."}
        sub="Start with a free 7-day trial membership — unlimited classes, no card required. Then it's £88/month rolling, with no joining fee and no long-term contract."
      />
      <Pricing />

      <section data-testid="membership-promises" className="px-6 md:px-12 py-32 md:py-40 bg-[#EDE8DF]">
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-12">
          The Synergy Promises
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#121212]/15">
          {promises.map((p, i) => (
            <motion.div
              key={p.title}
              data-testid={`promise-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-r border-[#121212]/15 p-8 md:p-12"
            >
              <span aria-hidden="true" className="font-display font-bold text-5xl text-outline-dark">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display font-semibold uppercase tracking-tight text-2xl text-[#121212]">
                {p.title}
              </h3>
              <p className="mt-4 text-sm md:text-base text-[#121212]/65 leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
