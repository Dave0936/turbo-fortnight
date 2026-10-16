import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const coaches = [
  {
    name: "Ross Paterson",
    role: "Owner / Head Coach",
    creds: "S&C and creative, functional fitness",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/9boktofu_ross.png",
  },
  {
    name: "Amy Toolis",
    role: "Partner / Group Coach",
    creds: "2x UK Personal Trainer of the Year / Mobility, S&C, rehab",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/pwxu7qj8_amy.png",
  },
  {
    name: "Bev Paterson",
    role: "Partner / Group Coach",
    creds: "Relentless high energy — no rest in class",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/cgldjz12_bev.png",
  },
  {
    name: "Jonny Jones",
    role: "Personal Trainer / Group Coach",
    creds: "S&C sports performance, rehab, intro to lifting",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/f5smtdvc_jonny.png",
  },
  {
    name: "Connor Friary",
    role: "Personal Trainer / Group Coach",
    creds: "Applied Sport & Exercise Science / Competitive amateur boxer",
    img: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/2tfhq816_conner.png",
  },
];

export const Coaches = () => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section id="coaches" data-testid="coaches-section" className="py-32 md:py-40 bg-[#1A1A1A] overflow-hidden">
      <div className="px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
            The Team
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-4xl md:text-6xl text-[#F4F4F0] max-w-3xl">
            A Family Team. An Award-Winning One.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#F4F4F0]/60">
            Home to a 2x UK Personal Trainer of the Year and coaches whose
            passion members call out by name — this is the team behind 4x UK
            Functional Gym of the Year.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            data-testid="coaches-prev-button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Scroll coaches left"
            className="p-4 border border-[#F4F4F0]/20 text-[#F4F4F0] hover:border-[#4C63F5] hover:text-[#4C63F5] disabled:opacity-30 disabled:hover:border-[#F4F4F0]/20 disabled:hover:text-[#F4F4F0] transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            data-testid="coaches-next-button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Scroll coaches right"
            className="p-4 border border-[#F4F4F0]/20 text-[#F4F4F0] hover:border-[#4C63F5] hover:text-[#4C63F5] disabled:opacity-30 disabled:hover:border-[#F4F4F0]/20 disabled:hover:text-[#F4F4F0] transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        data-testid="coaches-scroll-track"
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {coaches.map((c, i) => (
          <motion.article
            key={c.name}
            data-testid={`coach-card-${c.name.split(" ")[0].toLowerCase()}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: Math.min(i, 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="group snap-start shrink-0 w-[78vw] sm:w-[46vw] md:w-[30vw] lg:w-[24vw]"
          >
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src={c.img}
                alt={`Portrait of ${c.name}, ${c.role}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent" />
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 font-mono-accent text-xs text-[#F4F4F0]/60"
              >
                /{String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-6 border-t border-[#F4F4F0]/10 pt-5">
              <h3 className="font-display font-semibold uppercase tracking-tight text-2xl text-[#F4F4F0]">
                {c.name}
              </h3>
              <p className="text-[#4C63F5] font-mono-accent text-xs tracking-[0.2em] uppercase mt-1">
                {c.role}
              </p>
              <p className="text-xs text-[#F4F4F0]/50 leading-relaxed mt-3">
                {c.creds}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
