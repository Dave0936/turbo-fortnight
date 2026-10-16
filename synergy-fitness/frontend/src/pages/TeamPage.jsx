import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/landing/PageHeader";
import { CTA } from "@/components/landing/CTA";

const profiles = [
  {
    name: "Ross Paterson",
    role: "Owner / PT / Group Coach",
    speciality: "S&C and creative, functional fitness",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/9boktofu_ross.png",
    facts: [
      { q: "Place you've never been that you want to go?", a: "Argentina." },
      { q: "Are socks and sandals cool?", a: "Absolutely not." },
      { q: "Most hated food?", a: "Cucumber can go to hell." },
    ],
  },
  {
    name: "Amy Toolis",
    role: "Partner / Group Coach",
    speciality: "2x UK Personal Trainer of the Year — mobility, S&C, rehab, and generally being the friendliest person ever",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/pwxu7qj8_amy.png",
    facts: [
      { q: "Reputation?", a: "Officially the friendliest person ever — and twice voted the UK's best PT." },
    ],
  },
  {
    name: "Bev Paterson",
    role: "Partner / Group Coach / Admin",
    speciality: "Relentless high energy and giving no rest in class",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/cgldjz12_bev.png",
    facts: [
      { q: "The key to my heart is…", a: "Ice cream." },
      { q: "Time travel — future or past?", a: "The past, to go see God. AKA Elvis." },
      { q: "Any sport professionally?", a: "Gymnast." },
    ],
  },
  {
    name: "Jonny Jones",
    role: "Personal Trainer / Group Coach",
    speciality: "S&C sports performance, rehab, and introduction to lifting",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/f5smtdvc_jonny.png",
    facts: [
      { q: "Favourite movie of all time?", a: "Lord of the Rings: The Fellowship of the Ring." },
      { q: "Never fails to make you laugh?", a: "Alan Partridge." },
      { q: "Secret talent?", a: "Trumpet player." },
      { q: "Fight an alligator or a lion?", a: "Lion in water, alligator on land." },
    ],
  },
  {
    name: "Connor Friary",
    role: "Personal Trainer / Group Coach",
    speciality: "Degree in Applied Sport & Exercise Science and a background as a competitive amateur boxer",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/2tfhq816_conner.png",
    facts: [
      { q: "Background?", a: "Competitive amateur boxing — expect sharp pads work and sharper standards." },
    ],
  },
];

const CoachProfile = ({ coach, index }) => {
  const [open, setOpen] = useState(false);
  const flip = index % 2 === 1;
  return (
    <motion.div
      data-testid={`coach-profile-${coach.name.split(" ")[0].toLowerCase()}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-12 gap-6 items-start border-t border-[#121212]/15 py-14"
    >
      <div className={`col-span-10 col-start-2 md:col-span-3 ${flip ? "md:col-start-9 md:order-2" : "md:col-start-1"}`}>
        <div className="group relative overflow-hidden aspect-[3/4]">
          <img
            src={coach.img}
            alt={`Portrait of ${coach.name}`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-transparent to-transparent" />
          <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
        </div>
      </div>
      <div className={`col-span-12 md:col-span-6 ${flip ? "md:col-start-2 md:order-1" : "md:col-start-5"}`}>
        <span aria-hidden="true" className="font-mono-accent text-xs text-[#4C63F5]">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 font-display font-bold uppercase tracking-tight text-3xl md:text-5xl text-[#121212]">
          {coach.name}
        </h3>
        <p className="mt-2 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#121212]/50">
          {coach.role}
        </p>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-[#121212]/65 max-w-lg">
          {coach.speciality}
        </p>
        <button
          data-testid={`coach-facts-toggle-${coach.name.split(" ")[0].toLowerCase()}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="mt-8 flex items-center gap-3 font-mono-accent text-xs tracking-[0.25em] uppercase text-[#121212]/60 hover:text-[#4C63F5] transition-colors duration-300"
        >
          <Plus className={`w-4 h-4 transition-transform duration-500 ${open ? "rotate-45 text-[#4C63F5]" : ""}`} />
          {open ? "Hide The Fun Stuff" : "Off The Record"}
        </button>
        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"}`}>
          <div className="overflow-hidden">
            <div className="pt-6 space-y-4">
              {coach.facts.map((f, i) => (
                <div key={i} data-testid={`coach-fact-${index}-${i}`} className="border-l-2 border-[#4C63F5] pl-5">
                  <p className="font-mono-accent text-[11px] tracking-[0.15em] uppercase text-[#121212]/45">{f.q}</p>
                  <p className="mt-1 font-display font-medium uppercase tracking-wide text-lg text-[#121212]">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        kicker="The Team"
        title={"A Family Team.\nAn Award-Winning One."}
        sub="2x UK Personal Trainer of the Year. 4x UK Functional Gym of the Year. But what members talk about most is how this team makes them feel — welcome, coached, and capable of more."
      />
      <section data-testid="team-profiles" className="px-6 md:px-12 pt-24 md:pt-32 pb-24 md:pb-32 bg-[#EDE8DF]">
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
          Meet Them Properly
        </p>
        <h2 className="font-display font-bold uppercase tracking-tight text-4xl md:text-6xl text-[#121212] max-w-3xl mb-10">
          The People Behind The Whistle
        </h2>
        <div>
          {profiles.map((c, i) => (
            <CoachProfile key={c.name} coach={c} index={i} />
          ))}
        </div>
      </section>
      <section data-testid="team-ethos" className="px-6 md:px-12 py-32 md:py-40 bg-[#1A1A1A]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl text-[#F4F4F0]"
          >
            By Your Side. Every Session.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 text-base md:text-lg leading-relaxed text-[#F4F4F0]/70"
          >
            <p>
              There's no induction to pass and no experience required. A coach
              is by your side during every session — keeping your technique on
              point and giving you easier or harder options as you need them.
            </p>
            <p>
              Don't know your barbells from your burpees? Training for your
              first HYROX? Either way, walk through the door. You won't be
              disappointed.
            </p>
          </motion.div>
        </div>
      </section>
      <CTA />
    </>
  );
}
