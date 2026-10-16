import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Apple, Play } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/gb/app/synergy-group-fitness/id6736437314";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.goteamup.app.synergygroupfitness&hl=en_GB";

export const AppBadges = ({ dark = false }) => (
  <div className="flex flex-wrap gap-4">
    <a
      data-testid="app-store-link"
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 px-6 py-3.5 transition-colors duration-300 ${
        dark
          ? "bg-[#F4F4F0] text-[#121212] hover:bg-[#4C63F5] hover:text-[#F4F4F0]"
          : "bg-[#121212] text-[#F4F4F0] hover:bg-[#F4F4F0] hover:text-[#121212]"
      }`}
    >
      <Apple className="w-6 h-6" />
      <span className="text-left leading-tight">
        <span className="block font-mono-accent text-[9px] tracking-[0.2em] uppercase opacity-60">
          Download on the
        </span>
        <span className="block font-display font-semibold uppercase tracking-wide text-base">
          App Store
        </span>
      </span>
    </a>
    <a
      data-testid="google-play-link"
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 px-6 py-3.5 transition-colors duration-300 ${
        dark
          ? "bg-[#F4F4F0] text-[#121212] hover:bg-[#4C63F5] hover:text-[#F4F4F0]"
          : "bg-[#121212] text-[#F4F4F0] hover:bg-[#F4F4F0] hover:text-[#121212]"
      }`}
    >
      <Play className="w-6 h-6" />
      <span className="text-left leading-tight">
        <span className="block font-mono-accent text-[9px] tracking-[0.2em] uppercase opacity-60">
          Get it on
        </span>
        <span className="block font-display font-semibold uppercase tracking-wide text-base">
          Google Play
        </span>
      </span>
    </a>
  </div>
);

export const CTA = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "free_trial" }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong — try again or book via the app.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="join" data-testid="join-section" className="relative bg-[#4C63F5] px-6 md:px-12 py-32 md:py-40 overflow-hidden">
      <span
        aria-hidden="true"
        className="absolute -bottom-10 left-0 font-display font-bold uppercase text-[28vw] leading-none text-[#F4F4F0]/10 select-none pointer-events-none whitespace-nowrap"
      >
        Synergy
      </span>
      <div className="relative max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-6xl md:text-8xl lg:text-9xl"
        >
          Your Free Week
          <br />
          Starts Today.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-md text-base md:text-lg text-[#F4F4F0]/85 leading-relaxed"
        >
          Seven days. Unlimited classes. One movement assessment with a coach
          at our Leith studio. No card required — just show up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          {done ? (
            <div data-testid="join-success-message" className="flex items-center gap-4 bg-[#121212] text-[#F4F4F0] px-8 py-6 w-fit">
              <Check className="w-6 h-6 text-[#4C63F5]" />
              <p className="font-display uppercase tracking-wide text-lg">
                You're in. Check your inbox.
              </p>
            </div>
          ) : (
            <form data-testid="join-form" onSubmit={submit} className="flex flex-col sm:flex-row gap-0 max-w-xl">
              <input
                data-testid="join-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                className="flex-1 bg-[#121212] text-[#F4F4F0] placeholder:text-[#F4F4F0]/40 font-mono-accent text-sm tracking-[0.15em] px-6 py-5 outline-none focus:ring-2 focus:ring-[#F4F4F0] focus:ring-offset-2 focus:ring-offset-[#4C63F5]"
              />
              <button
                data-testid="join-submit-button"
                type="submit"
                disabled={sending}
                className="group flex items-center justify-center gap-2 bg-[#F4F4F0] text-[#121212] hover:bg-[#121212] hover:text-[#F4F4F0] disabled:opacity-50 font-display uppercase tracking-wide text-base px-10 py-5 transition-colors duration-300"
              >
                {sending ? "Claiming..." : "Claim Week"}
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          )}
          {error && (
            <p data-testid="join-error-message" className="mt-4 font-mono-accent text-xs tracking-[0.15em] uppercase text-[#121212]">
              {error}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/60 mb-4">
            Or book on the Synergy app
          </p>
          <AppBadges />
        </motion.div>
      </div>
    </section>
  );
};
