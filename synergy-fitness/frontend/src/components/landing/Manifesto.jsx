import { motion } from "framer-motion";

const chapters = [
  {
    num: "01",
    title: "Show Up",
    body: "Transformation begins before the first rep. It begins the moment you walk through the door and decide that average is no longer an option.",
  },
  {
    num: "02",
    title: "Do The Work",
    body: "No shortcuts. No hacks. Progressive overload, precise programming, and coaches who demand more from you than you demand from yourself.",
  },
  {
    num: "03",
    title: "Become More",
    body: "Strength built here doesn't stay here. It follows you into every room, every decision, every version of the person you're becoming.",
  },
];

export const Manifesto = () => {
  return (
    <section data-testid="manifesto-section" className="relative bg-[#EDE8DF] px-6 md:px-12 py-32 md:py-40">
      <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-16">
        The Manifesto
      </p>
      <div className="space-y-24 md:space-y-32">
        {chapters.map((c, i) => (
          <motion.div
            key={c.num}
            data-testid={`manifesto-chapter-${c.num}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-12 gap-6 items-start"
          >
            <span
              aria-hidden="true"
              className={`col-span-12 md:col-span-3 font-display font-bold text-7xl md:text-9xl leading-none text-outline-dark ${
                i % 2 === 1 ? "md:order-2 md:col-start-10 md:text-right" : "md:order-1 md:col-start-1"
              }`}
            >
              {c.num}
            </span>
            <div
              className={`col-span-12 md:col-span-6 ${
                i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:order-2 md:col-start-5"
              }`}
            >
              <h2 className="font-display font-bold uppercase tracking-tight text-4xl md:text-6xl text-[#121212] mb-6">
                {c.title}
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-[#121212]/65 max-w-lg">
                {c.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
