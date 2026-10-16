import { motion } from "framer-motion";

export const PageHeader = ({ kicker, title, sub }) => (
  <header data-testid="page-header" className="px-6 md:px-12 pt-40 md:pt-48 pb-16 md:pb-20">
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-6"
    >
      {kicker}
    </motion.p>
    <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-6xl md:text-8xl">
      {title.split("\n").map((line, i) => (
        <span key={i} className="block overflow-hidden pb-1">
          <motion.span
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
    {sub && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-[#F4F4F0]/70"
      >
        {sub}
      </motion.p>
    )}
  </header>
);
