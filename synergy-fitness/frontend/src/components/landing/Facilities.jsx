import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const IMG_MAIN =
  "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/sgkm6y72_ME177713.webp";
const IMG_TALL =
  "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/74xrvde3_ME177668.webp";
const IMG_WIDE =
  "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/ejrtpiqj_ME177672.webp";

const stats = [
  { value: "4x", label: "UK Functional Gym of the Year" },
  { value: "2x", label: "UK PT of the Year — Amy Toolis" },
  { value: "120+", label: "Classes Every Week" },
  { value: "EH6", label: "Leith, Edinburgh" },
];

const Frame = ({ src, alt, label, index, className, innerClassName, parallax }) => (
  <div className={`group relative overflow-hidden ${className}`} data-testid={`facility-frame-${index}`}>
    <motion.div style={parallax ? { y: parallax } : undefined} className="absolute -top-[8%] left-0 w-full h-[116%]">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${innerClassName || ""}`}
      />
    </motion.div>
    <div className="absolute inset-0 bg-[#4C63F5]/20 mix-blend-color group-hover:opacity-0 transition-opacity duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/50 via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 flex items-baseline justify-between px-5 py-4">
      <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/80">
        {label}
      </span>
      <span aria-hidden="true" className="font-mono-accent text-xs text-[#4C63F5]">
        /{String(index).padStart(2, "0")}
      </span>
    </div>
    <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
  </div>
);

export const Facilities = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yTall = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section id="facilities" ref={ref} data-testid="facilities-section" className="relative py-32 md:py-40 overflow-hidden">
      <div className="px-6 md:px-12 mb-20">
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
          The Facility
        </p>
        <h2 className="font-display font-bold uppercase tracking-tight text-4xl md:text-6xl text-[#F4F4F0] max-w-4xl">
          A Functional Gym Built For Serious Training
        </h2>
      </div>

      <div className="relative px-6 md:px-12 grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-8">
          <Frame
            src={IMG_MAIN}
            alt="The Synergy training floor — rowers, treadmills and rig under blue light"
            label="The Engine Room"
            index={1}
            className="aspect-[16/10]"
          />
        </div>
        <div className="col-span-8 col-start-3 md:col-span-3 md:col-start-10 md:-mt-32">
          <Frame
            src={IMG_TALL}
            alt="Competition plates racked on the lifting rig at Synergy"
            label="The Rig"
            index={2}
            className="aspect-[3/4]"
            parallax={yTall}
          />
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-4 mt-6 md:mt-2">
          <Frame
            src={IMG_WIDE}
            alt="Dumbbell racks and open training space inside the Synergy gym"
            label="The Floor"
            index={3}
            className="aspect-[16/9]"
          />
        </div>
      </div>

      <div className="mt-24 md:mt-32 border-t border-b border-[#F4F4F0]/10 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            data-testid={`facility-stat-${i}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`px-6 md:px-12 py-12 md:py-16 ${i > 0 ? "border-l border-[#F4F4F0]/10" : ""} ${i >= 2 ? "border-t md:border-t-0 border-[#F4F4F0]/10" : ""}`}
          >
            <p className="font-display font-bold text-5xl md:text-7xl text-[#F4F4F0] tracking-tight">
              {s.value}
            </p>
            <p className="font-mono-accent text-[11px] md:text-xs tracking-[0.2em] uppercase text-[#F4F4F0]/50 mt-3">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
