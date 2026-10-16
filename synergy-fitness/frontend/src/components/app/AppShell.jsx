import { NavLink, Outlet, Link } from "react-router-dom";
import { Home, CalendarDays, Activity, Newspaper, User } from "lucide-react";

const tabs = [
  { label: "Home", to: "/app", icon: Home, end: true },
  { label: "Book", to: "/app/book", icon: CalendarDays },
  { label: "Progress", to: "/app/progress", icon: Activity },
  { label: "News", to: "/app/news", icon: Newspaper },
  { label: "Profile", to: "/app/profile", icon: User },
];

export const AppShell = () => {
  return (
    <div data-testid="app-shell" className="min-h-screen bg-[#121212] text-[#F4F4F0] pb-24">
      <header className="sticky top-0 z-40 bg-[#121212]/85 backdrop-blur-xl border-b border-[#F4F4F0]/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" data-testid="app-logo">
          <img src="/synergy-logo.png" alt="Synergy Group Fitness" className="h-6 w-auto" />
        </Link>
        <span className="font-mono-accent text-[10px] tracking-[0.25em] uppercase text-[#F4F4F0]/40">
          Members
        </span>
      </header>

      <Outlet />

      <nav
        data-testid="app-tab-bar"
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-xl border-t border-[#F4F4F0]/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {tabs.map((t) => (
            <NavLink
              key={t.label}
              to={t.to}
              end={t.end}
              data-testid={`tab-${t.label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1.5 py-3 transition-colors duration-300 ${
                  isActive ? "text-[#4C63F5]" : "text-[#F4F4F0]/45 hover:text-[#F4F4F0]"
                }`
              }
            >
              <t.icon className="w-5 h-5" />
              <span className="font-mono-accent text-[9px] tracking-[0.2em] uppercase">{t.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
