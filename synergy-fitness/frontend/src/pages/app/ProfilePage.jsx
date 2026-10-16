import { motion } from "framer-motion";
import { LogOut, Mail, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div data-testid="profile-page" className="px-6 pt-10 pb-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#4C63F5] mb-3">Profile</p>
        <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-[#F4F4F0] text-5xl mb-8">
          {user?.name || "Member"}.
        </h1>
      </motion.div>

      <div className="border-t border-l border-[#F4F4F0]/10">
        <div className="border-b border-r border-[#F4F4F0]/10 p-6 flex items-center gap-4">
          <Mail className="w-4 h-4 text-[#4C63F5] shrink-0" />
          <div>
            <p className="font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#F4F4F0]/40">Email</p>
            <p data-testid="profile-email" className="mt-1 text-sm text-[#F4F4F0]">{user?.email}</p>
          </div>
        </div>
        <div className="border-b border-r border-[#F4F4F0]/10 p-6 flex items-center gap-4">
          <Shield className="w-4 h-4 text-[#4C63F5] shrink-0" />
          <div>
            <p className="font-mono-accent text-[10px] tracking-[0.2em] uppercase text-[#F4F4F0]/40">Membership</p>
            <p data-testid="profile-membership" className="mt-1 text-sm text-[#F4F4F0]">
              Managed via the Synergy app & member portal
            </p>
          </div>
        </div>
      </div>

      <button
        data-testid="sign-out-button"
        onClick={signOut}
        className="mt-10 w-full flex items-center justify-center gap-3 border border-[#F4F4F0]/20 hover:border-[#4C63F5] hover:text-[#4C63F5] text-[#F4F4F0] font-display uppercase tracking-wide text-base px-10 py-5 transition-colors duration-300"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
