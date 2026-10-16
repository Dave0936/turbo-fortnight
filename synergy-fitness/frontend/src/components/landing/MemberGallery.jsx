import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const shots = [
  {
    src: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/lhvwi4mn_S1050746.webp",
    alt: "Members training together in a Synergy group class with battle ropes",
    label: "Stronger Together",
  },
  {
    src: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/zjmwmw1o_S1050436.webp",
    alt: "Member grinding through an overhead barbell press",
    label: "Every Rep Counts",
  },
  {
    src: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/llgs8gyg_S1040897.webp",
    alt: "A Synergy coach guiding members through a stretching session",
    label: "Coached, Always",
  },
  {
    src: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/lz254m8q_S1040674.webp",
    alt: "A young member learning to row with a coach beside her",
    label: "Every Level Welcome",
  },
  {
    src: "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/vn5zk356_S1040412.webp",
    alt: "A teen member training on suspension straps with a smile",
    label: "The Next Generation",
  },
];

export const MemberGallery = () => {
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
    <section data-testid="member-gallery" className="py-32 md:py-40 overflow-hidden">
      <div className="px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
            The Community
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-4xl md:text-6xl text-[#F4F4F0] max-w-3xl">
            Real People. Real Work.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            data-testid="gallery-prev-button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Scroll gallery left"
            className="p-4 border border-[#F4F4F0]/20 text-[#F4F4F0] hover:border-[#4C63F5] hover:text-[#4C63F5] disabled:opacity-30 disabled:hover:border-[#F4F4F0]/20 disabled:hover:text-[#F4F4F0] transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            data-testid="gallery-next-button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Scroll gallery right"
            className="p-4 border border-[#F4F4F0]/20 text-[#F4F4F0] hover:border-[#4C63F5] hover:text-[#4C63F5] disabled:opacity-30 disabled:hover:border-[#F4F4F0]/20 disabled:hover:text-[#F4F4F0] transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        data-testid="gallery-scroll-track"
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((s, i) => (
          <motion.figure
            key={s.label}
            data-testid={`gallery-shot-${i}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: Math.min(i, 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group snap-start shrink-0 w-[82vw] sm:w-[55vw] md:w-[38vw] lg:w-[30vw]"
          >
            <div className="relative overflow-hidden aspect-[4/5]">
              <img
                src={s.src}
                alt={s.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-[#4C63F5]/20 mix-blend-color group-hover:opacity-0 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 via-transparent to-transparent" />
              <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 flex items-baseline justify-between px-5 py-4">
                <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/80">
                  {s.label}
                </span>
                <span aria-hidden="true" className="font-mono-accent text-xs text-[#4C63F5]">
                  /{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </motion.figure>
        ))}
      </div>
    </section>
  );
};
