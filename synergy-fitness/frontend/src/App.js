import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import "@/App.css";
import { AuthProvider } from "@/context/AuthContext";
import { Preloader } from "@/components/landing/Preloader";
import { Cursor } from "@/components/landing/Cursor";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ProtectedRoute } from "@/components/app/ProtectedRoute";
import { AppShell } from "@/components/app/AppShell";
import Home from "@/pages/Home";
import ProgramsPage from "@/pages/ProgramsPage";
import SchedulePage from "@/pages/SchedulePage";
import TeamPage from "@/pages/TeamPage";
import MembershipPage from "@/pages/MembershipPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import KidsPage from "@/pages/KidsPage";
import NewsPage from "@/pages/NewsPage";
import NewsPostPage from "@/pages/NewsPostPage";
import PrivacyPage from "@/pages/PrivacyPage";
import LoginPage from "@/pages/app/LoginPage";
import MemberHome from "@/pages/app/MemberHome";
import BookPage from "@/pages/app/BookPage";
import ProgressPage from "@/pages/app/ProgressPage";
import AppNewsPage from "@/pages/app/AppNewsPage";
import ProfilePage from "@/pages/app/ProfilePage";

const ScrollManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const SiteChrome = ({ ready }) => {
  const { pathname } = useLocation();
  const isApp = pathname.startsWith("/app");

  return (
    <>
      <ScrollManager />
      {!isApp && <Nav ready={ready} />}
      <Routes>
        <Route path="/" element={<Home ready={ready} />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/kids" element={<KidsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsPostPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberHome />} />
          <Route path="book" element={<BookPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="news" element={<AppNewsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      {!isApp && <Footer />}
    </>
  );
};

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href"));
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -60 });
      }
    };
    document.addEventListener("click", onAnchor);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchor);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div data-testid="app-root" className="bg-[#121212] text-[#F4F4F0] min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <Cursor />
      <AnimatePresence>
        {!ready && <Preloader onComplete={() => setReady(true)} />}
      </AnimatePresence>
      <AuthProvider>
        <BrowserRouter>
          <SiteChrome ready={ready} />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
