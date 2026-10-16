import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CTA } from "@/components/landing/CTA";
import { newsPosts } from "@/data/news";

export default function NewsPostPage() {
  const { slug } = useParams();
  const post = newsPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <section className="px-6 md:px-12 pt-48 pb-40 min-h-screen">
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-6">404</p>
        <h1 className="font-display font-bold uppercase tracking-tight text-5xl text-[#F4F4F0]">
          Story Not Found
        </h1>
        <Link
          data-testid="news-back-link"
          to="/news"
          className="mt-8 inline-flex items-center gap-2 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#F4F4F0]/60 hover:text-[#4C63F5] transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back To The Journal
        </Link>
      </section>
    );
  }

  return (
    <>
      <article data-testid="news-post" className="pt-40 md:pt-48 pb-32 md:pb-40">
        <div className="px-6 md:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="font-mono-accent text-xs tracking-[0.25em] uppercase text-[#4C63F5]">
              {post.category}
            </span>
            <span className="w-8 h-px bg-[#F4F4F0]/20" />
            <span className="font-mono-accent text-xs tracking-[0.25em] uppercase text-[#F4F4F0]/40">
              {post.date}
            </span>
          </motion.div>

          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.95] text-[#F4F4F0] text-5xl md:text-7xl">
            {post.title.split("\n").map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-20 px-6 md:px-12"
        >
          <div className="relative overflow-hidden aspect-[21/9] max-h-[560px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#4C63F5]/15 mix-blend-color" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 via-transparent to-transparent" />
            <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5]" aria-hidden="true" />
          </div>
        </motion.div>

        <div className="px-6 md:px-12 mt-16 md:mt-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Link
              data-testid="news-back-link"
              to="/news"
              className="inline-flex items-center gap-2 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#F4F4F0]/60 hover:text-[#4C63F5] transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" /> All Stories
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-7"
          >
            <p className="font-display font-medium uppercase tracking-tight text-2xl md:text-3xl leading-snug text-[#F4F4F0]">
              {post.excerpt}
            </p>
            <div className="mt-10 space-y-6">
              {post.body.map((para, i) => (
                <p key={i} data-testid={`news-paragraph-${i}`} className="text-base md:text-lg leading-relaxed text-[#F4F4F0]/70">
                  {para}
                </p>
              ))}
            </div>
            {post.quote && (
              <blockquote data-testid="news-pull-quote" className="mt-14 border-l-2 border-[#4C63F5] pl-8">
                <p className="font-display font-medium uppercase tracking-tight text-2xl md:text-3xl leading-snug text-[#F4F4F0]">
                  "{post.quote.text}"
                </p>
                <footer className="mt-4 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#F4F4F0]/50">
                  — {post.quote.name}
                </footer>
              </blockquote>
            )}
          </motion.div>
        </div>
      </article>
      <CTA />
    </>
  );
}
