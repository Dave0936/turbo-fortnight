import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/landing/PageHeader";
import { CTA } from "@/components/landing/CTA";
import { newsPosts } from "@/data/news";

const [featured, ...rest] = newsPosts;

export default function NewsPage() {
  return (
    <>
      <PageHeader
        kicker="News & Stories"
        title={"The Synergy\nJournal."}
        sub="Awards, member transformations, events, and everything happening inside Edinburgh's most-awarded functional gym."
      />

      <section data-testid="news-featured" className="px-6 md:px-12 pb-16">
        <Link to={`/news/${featured.slug}`} data-testid="news-featured-card" data-cursor="view" className="group grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8 relative overflow-hidden aspect-[16/9]">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-[#4C63F5]/20 mix-blend-color group-hover:opacity-0 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-transparent to-transparent" />
            <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono-accent text-xs tracking-[0.25em] uppercase text-[#4C63F5]">
              {featured.category} — {featured.date}
            </p>
            <h2 className="mt-4 font-display font-bold uppercase tracking-tight text-3xl md:text-4xl text-[#F4F4F0] group-hover:text-[#4C63F5] transition-colors duration-500 leading-[1.05]">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm md:text-base text-[#F4F4F0]/60 leading-relaxed">
              {featured.excerpt}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#F4F4F0]/50 group-hover:text-[#4C63F5] transition-colors duration-300">
              Read Story <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </section>

      <section data-testid="news-grid" className="px-6 md:px-12 py-24 md:py-32 bg-[#EDE8DF]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#121212]/15">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-r border-[#121212]/15"
            >
              <Link
                to={`/news/${post.slug}`}
                data-testid={`news-card-${post.slug}`}
                data-cursor="view"
                className="group block p-8 hover:bg-[#121212] transition-colors duration-500 h-full"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#4C63F5]">
                    {post.category}
                  </span>
                  <span className="font-mono-accent text-[10px] text-[#121212]/40 group-hover:text-[#F4F4F0]/40 transition-colors duration-500">
                    /{String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display font-semibold uppercase tracking-tight text-2xl text-[#121212] group-hover:text-[#F4F4F0] transition-colors duration-500 leading-tight">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm text-[#121212]/60 group-hover:text-[#F4F4F0]/65 transition-colors duration-500 leading-relaxed">{post.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#121212]/40 group-hover:text-[#4C63F5] transition-colors duration-300">
                  Read <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
