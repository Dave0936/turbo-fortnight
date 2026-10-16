import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const inputCls =
  "w-full bg-transparent border-b border-[#F4F4F0]/20 focus:border-[#4C63F5] text-[#F4F4F0] placeholder:text-[#F4F4F0]/35 font-mono-accent text-sm tracking-[0.1em] px-0 py-4 outline-none transition-colors duration-300";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from?.pathname || "/app";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="login-page" className="min-h-screen bg-[#121212] flex flex-col px-6 pt-10 pb-16">
      <Link to="/" data-testid="login-logo" className="w-fit">
        <img src="/synergy-logo.png" alt="Synergy Group Fitness" className="h-7 w-auto" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto"
      >
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-4">
          Members Area
        </p>
        <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl md:text-6xl mb-10">
          {mode === "login" ? "Welcome Back." : "Join The Club."}
        </h1>

        <div className="flex border border-[#F4F4F0]/15 mb-10">
          {["login", "register"].map((m) => (
            <button
              key={m}
              data-testid={`auth-mode-${m}`}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-3.5 font-display uppercase tracking-wide text-sm transition-colors duration-300 ${
                mode === m ? "bg-[#4C63F5] text-[#F4F4F0]" : "text-[#F4F4F0]/50 hover:text-[#F4F4F0]"
              }`}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form data-testid="auth-form" onSubmit={submit} className="space-y-7">
          {mode === "register" && (
            <input
              data-testid="auth-name-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="YOUR NAME"
              className={inputCls}
            />
          )}
          <input
            data-testid="auth-email-input"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="YOUR EMAIL"
            className={inputCls}
          />
          <input
            data-testid="auth-password-input"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="PASSWORD (8+ CHARACTERS)"
            className={inputCls}
          />
          {error && (
            <p data-testid="auth-error-message" className="font-mono-accent text-xs tracking-[0.15em] uppercase text-[#4C63F5]">
              {error}
            </p>
          )}
          <button
            data-testid="auth-submit-button"
            type="submit"
            disabled={busy}
            className="group w-full flex items-center justify-center gap-3 bg-[#4C63F5] hover:bg-[#3b4ce0] disabled:opacity-50 text-[#F4F4F0] font-display uppercase tracking-wide text-base px-10 py-5 transition-colors duration-300"
          >
            {busy ? "One Moment..." : mode === "login" ? "Sign In" : "Create Account"}
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </form>

        <p className="mt-8 text-sm text-[#F4F4F0]/45 leading-relaxed">
          New to Synergy? Start with the{" "}
          <Link to="/membership" className="text-[#4C63F5] hover:underline">
            free 7-day trial
          </Link>{" "}
          — no card required.
        </p>
      </motion.div>
    </div>
  );
}
