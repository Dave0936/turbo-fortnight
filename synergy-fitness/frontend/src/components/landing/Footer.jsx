import { Link } from "react-router-dom";
import { AppBadges } from "@/components/landing/CTA";

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-[#121212] border-t border-[#F4F4F0]/10 px-6 md:px-12 pt-20 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-20">
        <div className="col-span-2 md:col-span-4">
          <img
            src="/synergy-logo.png"
            alt="Synergy Group Fitness"
            className="h-9 w-auto"
            data-testid="footer-logo"
          />
          <p className="mt-4 max-w-xs text-sm text-[#F4F4F0]/50 leading-relaxed">
            Strength. Fitness. Community. An award-winning functional gym in
            the heart of Leith, Edinburgh.
          </p>
        </div>
        <div>
          <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-5">Visit</p>
          <ul className="space-y-3 text-sm text-[#F4F4F0]/70">
            <li data-testid="footer-location-downtown">35 West Bowling Green Street</li>
            <li data-testid="footer-location-riverside">Leith, Edinburgh</li>
            <li data-testid="footer-location-north">EH6 5NX</li>
          </ul>
        </div>
        <div>
          <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-5">Explore</p>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Programs", to: "/programs" },
              { label: "Schedule", to: "/schedule" },
              { label: "Team", to: "/team" },
              { label: "Membership", to: "/membership" },
              { label: "FAQ", to: "/faq" },
              { label: "News", to: "/news" },
              { label: "Teen & Kids", to: "/kids" },
              { label: "Contact", to: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  data-testid={`footer-link-${l.label.toLowerCase()}`}
                  to={l.to}
                  className="text-[#F4F4F0]/70 hover:text-[#4C63F5] transition-colors duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mb-5">Connect</p>
          <ul className="space-y-3 text-sm">
            {["Instagram", "YouTube", "Spotify"].map((s) => (
              <li key={s}>
                <a
                  data-testid={`footer-social-${s.toLowerCase()}`}
                  href="#top"
                  className="text-[#F4F4F0]/70 hover:text-[#4C63F5] transition-colors duration-300"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono-accent text-[11px] tracking-[0.25em] uppercase text-[#F4F4F0]/40 mt-8 mb-4">
            Get The App
          </p>
          <AppBadges dark />
        </div>
      </div>
      <p
        aria-hidden="true"
        className="font-display font-bold uppercase text-outline text-[13vw] leading-none whitespace-nowrap overflow-hidden select-none text-center"
      >
        Synergy
      </p>
      <div className="mt-10 flex flex-col md:flex-row justify-between gap-3 border-t border-[#F4F4F0]/10 pt-6">
        <p className="font-mono-accent text-[11px] tracking-[0.2em] uppercase text-[#F4F4F0]/40">
          © 2026 Synergy Group Fitness
        </p>
        <div className="flex gap-6">
          <Link data-testid="footer-link-privacy" to="/privacy" className="font-mono-accent text-[11px] tracking-[0.2em] uppercase text-[#F4F4F0]/40 hover:text-[#4C63F5] transition-colors duration-300">
            Privacy
          </Link>
          <Link data-testid="footer-link-faq-bottom" to="/faq" className="font-mono-accent text-[11px] tracking-[0.2em] uppercase text-[#F4F4F0]/40 hover:text-[#4C63F5] transition-colors duration-300">
            FAQ
          </Link>
        </div>
        <p className="font-mono-accent text-[11px] tracking-[0.2em] uppercase text-[#F4F4F0]/40">
          #morethanjustagym
        </p>
      </div>
    </footer>
  );
};
