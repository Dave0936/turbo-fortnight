import { motion } from "framer-motion";

const quotes = [
  {
    quote: "Synergy has been integral to getting back my fitness and confidence after a major heart operation. It's a family business with a warm, welcoming community.",
    name: "Leigh McIntyre",
    detail: "Member / Edinburgh",
  },
  {
    quote: "Best gym in Edinburgh! I knew as soon as I finished my first class that this was the gym for me. Functional, friendly and fun.",
    name: "Amanda Williams",
    detail: "Member / #morethanjustagym",
  },
  {
    quote: "Synergy is a 10/10 for me. Best gym experience in over 40 years. The coaches are amazing and I love their passion.",
    name: "Paul Cooper",
    detail: "Member / 40 years of gyms",
  },
];

export const Testimonials = () => {
  return (
    <section data-testid="testimonials-section" className="px-6 md:px-12 py-32 md:py-40 bg-[#1A1A1A]">
      <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-20">
        More Than Just A Gym
      </p>
      <div className="space-y-24 md:space-y-32">
        {quotes.map((q, i) => (
          <motion.blockquote
            key={q.name}
            data-testid={`testimonial-${i}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-4xl ${i % 2 === 1 ? "md:ml-auto md:text-right" : ""}`}
          >
            <p className="font-display font-medium uppercase tracking-tight text-3xl md:text-5xl leading-[1.1] text-[#F4F4F0]">
              <span className="text-[#4C63F5]">"</span>
              {q.quote}
              <span className="text-[#4C63F5]">"</span>
            </p>
            <footer className="mt-8">
              <p className="font-mono-accent text-sm text-[#F4F4F0]">{q.name}</p>
              <p className="font-mono-accent text-xs text-[#F4F4F0]/50 mt-1 tracking-[0.15em] uppercase">
                {q.detail}
              </p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
};
