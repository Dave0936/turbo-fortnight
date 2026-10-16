import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { PageHeader } from "@/components/landing/PageHeader";
import { AppBadges } from "@/components/landing/CTA";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls =
  "w-full bg-transparent border-b border-[#F4F4F0]/20 focus:border-[#4C63F5] text-[#F4F4F0] placeholder:text-[#F4F4F0]/35 font-mono-accent text-sm tracking-[0.1em] px-0 py-4 outline-none transition-colors duration-300";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact" }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong — please try again or book via the app.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        kicker="Contact"
        title={"Talk To\nThe Team."}
        sub="Questions about classes, memberships, personal training, or private group sessions — send a message and a coach will get back to you."
      />

      <section data-testid="contact-body" className="px-6 md:px-12 pb-32 md:pb-40 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          {done ? (
            <div data-testid="contact-success-message" className="flex items-center gap-4 border border-[#4C63F5] px-8 py-6 w-fit">
              <Check className="w-6 h-6 text-[#4C63F5]" />
              <p className="font-display uppercase tracking-wide text-lg text-[#F4F4F0]">
                Message received. We'll be in touch.
              </p>
            </div>
          ) : (
            <form data-testid="contact-form" onSubmit={submit} className="space-y-8 max-w-lg">
              <input
                data-testid="contact-name-input"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="YOUR NAME"
                className={inputCls}
              />
              <input
                data-testid="contact-email-input"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="YOUR EMAIL"
                className={inputCls}
              />
              <textarea
                data-testid="contact-message-input"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="HOW CAN WE HELP?"
                className={`${inputCls} resize-none`}
              />
              {error && (
                <p data-testid="contact-error-message" className="font-mono-accent text-xs tracking-[0.15em] uppercase text-[#4C63F5]">
                  {error}
                </p>
              )}
              <button
                data-testid="contact-submit-button"
                type="submit"
                disabled={sending}
                className="group inline-flex items-center gap-3 bg-[#4C63F5] hover:bg-[#3b4ce0] disabled:opacity-50 text-[#F4F4F0] font-display uppercase tracking-wide text-base px-10 py-5 transition-colors duration-300"
              >
                {sending ? "Sending..." : "Send Message"}
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          )}

          <div className="mt-16">
            <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-4">
              Prefer the app?
            </p>
            <AppBadges />
          </div>
        </div>

        <div className="space-y-px">
          <motion.div
            data-testid="location-leith"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="border border-[#F4F4F0]/10 p-8 md:p-10"
          >
            <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#4C63F5] mb-3">
              Studio 01
            </p>
            <h3 className="font-display font-semibold uppercase tracking-tight text-3xl text-[#F4F4F0]">
              Synergy Leith
            </h3>
            <p className="mt-4 text-sm text-[#F4F4F0]/60 leading-relaxed">
              35 West Bowling Green Street
              <br />
              Leith, Edinburgh, EH6 5NX
            </p>
            <a
              data-testid="location-leith-map-link"
              href="https://www.google.co.uk/maps/place/Synergy+Group+Fitness+Edinburgh/@55.9722302,-3.1864297,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-mono-accent text-xs tracking-[0.2em] uppercase text-[#F4F4F0]/60 hover:text-[#4C63F5] transition-colors duration-300"
            >
              <MapPin className="w-4 h-4" /> Open In Maps
            </a>
          </motion.div>
          <motion.div
            data-testid="location-second"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="border border-[#F4F4F0]/10 p-8 md:p-10"
          >
            <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#4C63F5] mb-3">
              Studio 02
            </p>
            <h3 className="font-display font-semibold uppercase tracking-tight text-3xl text-[#F4F4F0]">
              Second Edinburgh Studio
            </h3>
            <p className="mt-4 text-sm text-[#F4F4F0]/60 leading-relaxed">
              Our second studio hosts personal training and private group
              sessions. Address and access details are shared when you book, or
              just ask the team.
            </p>
          </motion.div>
        </div>
      </section>

      <section data-testid="contact-map" className="px-6 md:px-12 pb-32 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border border-[#F4F4F0]/10"
        >
          <iframe
            data-testid="contact-map-iframe"
            title="Map of Synergy Group Fitness, 35 West Bowling Green Street, Leith, Edinburgh"
            src="https://maps.google.com/maps?q=Synergy%20Group%20Fitness%2C%2035%20West%20Bowling%20Green%20Street%2C%20Edinburgh%20EH6%205NX&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[380px] md:h-[460px] grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700"
            loading="lazy"
          />
          <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#4C63F5] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 bg-[#121212] px-5 py-3 pointer-events-none">
            <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/80">
              35 West Bowling Green Street — Leith
            </span>
          </div>
        </motion.div>
      </section>
    </>
  );
}
