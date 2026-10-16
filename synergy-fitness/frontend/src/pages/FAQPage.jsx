import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/landing/PageHeader";
import { CTA } from "@/components/landing/CTA";

const faqs = [
  {
    q: "How do I find prices and book a class or membership?",
    a: "Head to the Membership page to see our structure, then book through the Synergy app or online. Your account shows every class, pass, and membership price before you commit.",
  },
  {
    q: "Do I have to be a member to train at Synergy?",
    a: "No. You can attend classes pay-as-you-go or with a multi-class pass — though membership works out more cost-effective once you're training more than 1.5 classes a week.",
  },
  {
    q: "Is there a minimum contract duration?",
    a: "We don't believe in 12-month contracts. If you decide to cancel, we simply ask for one month's notice in writing to admin@synergygroupfitness.co.uk.",
  },
  {
    q: "Do I have to pay a joining fee?",
    a: "After 18 years in the industry, we still don't know how other gyms justify a joining fee. So, no.",
  },
  {
    q: "Do I need to complete an induction first?",
    a: "No. We'll be by your side during every session to support you and keep your technique on point, with easier or harder options as required. We're here for you.",
  },
  {
    q: "Can I use the gym on my own outside class times?",
    a: "Our gyms are used primarily for 1-2-1 personal training, bespoke group classes, and sports performance sessions — but we do offer a selection of open gym access times for members.",
  },
  {
    q: "Do you offer personal training?",
    a: "We sure do — and we're damn good at it. Get in touch through the contact page for more info.",
  },
  {
    q: "Can I book private group or sports performance sessions?",
    a: "Yes. We run private sessions for sports teams, friends, colleagues, and everything in between. Contact us to arrange yours.",
  },
  {
    q: "What happens if I can't attend a class I'm booked into?",
    a: "Life gets in the way sometimes. Cancel up to 5 hours before the class and your account gets a credit to rebook. Inside 5 hours the session is charged in full — and consistent late cancellations trigger a one-week booking pause.",
  },
  {
    q: "Do I need to book, or can I just turn up? Can I pay cash?",
    a: "All classes must be booked online or through the app, and we don't accept cash payments.",
  },
  {
    q: "What if the class I want looks fully booked?",
    a: "Book in anyway. When people cancel, the reserve list moves up automatically — it's exceptionally rare we don't get everyone in.",
  },
  {
    q: "Do I get nutritional support with my membership?",
    a: "Absolutely — you can't out-train a bad diet. Synergy Plus members get complimentary access to our online SG3 fat-loss and performance programme.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHeader
        kicker="FAQ"
        title={"Straight Answers.\nNo Small Print."}
        sub="Everything people ask before their first session. Something missing? The team replies fast — head to Contact."
      />
      <section data-testid="faq-list" className="px-6 md:px-12 pb-32 md:pb-40 max-w-5xl">
        <div className="border-t border-[#F4F4F0]/10">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-[#F4F4F0]/10"
            >
              <button
                data-testid={`faq-question-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-6 py-7 text-left group"
              >
                <span className={`font-display font-semibold uppercase tracking-tight text-xl md:text-2xl transition-colors duration-300 ${open === i ? "text-[#4C63F5]" : "text-[#F4F4F0] group-hover:text-[#4C63F5]"}`}>
                  {f.q}
                </span>
                <Plus className={`w-6 h-6 shrink-0 transition-transform duration-500 ${open === i ? "rotate-45 text-[#4C63F5]" : "text-[#F4F4F0]/50"}`} />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${open === i ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p data-testid={`faq-answer-${i}`} className="pb-7 pr-10 max-w-2xl text-base leading-relaxed text-[#F4F4F0]/65">
                    {f.a}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
