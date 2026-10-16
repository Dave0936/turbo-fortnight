import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Programs", to: "/programs", id: "programs" },
  { label: "Schedule", to: "/schedule", id: "schedule" },
  { label: "Team", to: "/team", id: "team" },
  { label: "Teen & Kids", to: "/kids", id: "kids" },
  { label: "Membership", to: "/membership", id: "membership" },
  { label: "News", to: "/news", id: "news" },
  { label: "Contact", to: "/contact", id: "contact" },
];

const mobileLinks = [...links.slice(0, 6), { label: "FAQ", to: "/faq", id: "faq" }, links[6]];

export const Nav = ({ ready = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        data-testid="main-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled || open
            ? "bg-[#121212]/70 backdrop-blur-xl border-b border-[#F4F4F0]/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
          <Link
            data-testid="nav-logo"
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
          >
            <img
              src="/synergy-logo.png"
              alt="Synergy Group Fitness"
              className="h-6 md:h-7 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <NavLink
                key={l.label}
                data-testid={`nav-link-${l.id}`}
                to={l.to}
                className={({ isActive }) =>
                  `font-mono-accent text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                    isActive ? "text-[#4C63F5]" : "text-[#F4F4F0]/70 hover:text-[#4C63F5]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              data-testid="nav-join-button"
              to="/membership"
              onClick={() => setOpen(false)}
              className="group hidden sm:flex items-center gap-2 bg-[#4C63F5] hover:bg-[#3b4ce0] text-[#F4F4F0] font-display uppercase tracking-wide text-sm px-6 py-3 transition-colors duration-300"
            >
              Join Now
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <button
              data-testid="mobile-menu-button"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden text-[#F4F4F0] p-2"
            >
              {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: "-4%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-4%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#121212] flex flex-col justify-center px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {mobileLinks.map((l, i) => (
                <div key={l.label} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      data-testid={`mobile-nav-link-${l.id}`}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 font-display font-bold uppercase tracking-tight text-5xl text-[#F4F4F0] py-2"
                    >
                      <span className="font-mono-accent text-xs text-[#4C63F5]">
                        /{String(i + 1).padStart(2, "0")}
                      </span>
                      {l.label}
                    </NavLink>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link
                data-testid="mobile-join-button"
                to="/membership"
                onClick={() => setOpen(false)}
                className="mt-12 flex items-center justify-center gap-2 bg-[#4C63F5] text-[#F4F4F0] font-display uppercase tracking-wide text-lg px-8 py-5"
              >
                Join Now
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
