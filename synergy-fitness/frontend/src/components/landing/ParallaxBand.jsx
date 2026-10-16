import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const IMG_BAND =
  "https://customer-assets-0z36b82j.emergentagent.net/job_elite-performance-13/artifacts/nimwp61g_ME177665.webp";

export const ParallaxBand = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} data-testid="parallax-band" className="relative h-[70vh] min-h-[480px] overflow-hidden">
      <motion.div style={{ y }} className="absolute -top-[12%] left-0 w-full h-[124%]">
        <img
          src={IMG_BAND}
          alt="The Synergy lifting rig and punching bag under spotlights"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#4C63F5]/15 mix-blend-color" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/40" />
      <div className="relative z-10 h-full flex items-end px-6 md:px-12 pb-14">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl md:text-7xl max-w-4xl"
        >
          Results-Based <span className="text-[#4C63F5]">Group Fitness</span>
        </motion.p>
      </div>
    </section>
  );
};
