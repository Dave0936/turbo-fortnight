import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { newsPosts } from "@/data/news";

export default function AppNewsPage() {
  return (
    <div data-testid="app-news-page" className="px-6 pt-10 pb-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-3">News & Offers</p>
        <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl mb-8">
          The Journal.
        </h1>
      </motion.div>

      <div className="space-y-px">
        {newsPosts.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/news/${p.slug}`}
              data-testid={`app-news-${p.slug}`}
              className="group block border border-[#F4F4F0]/10 p-5 hover:bg-[#1A1A1A] transition-colors duration-300"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#4C63F5]">
                  {p.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#F4F4F0]/30 group-hover:text-[#4C63F5] transition-colors duration-300" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-tight text-xl text-[#F4F4F0] group-hover:text-[#4C63F5] transition-colors duration-300 leading-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-[#F4F4F0]/55 leading-relaxed line-clamp-2">{p.excerpt}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
