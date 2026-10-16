import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user === null) {
    return (
      <div data-testid="auth-loading" className="min-h-screen bg-[#121212] flex items-center justify-center">
        <span className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#F4F4F0]/40 animate-pulse">
          Loading
        </span>
      </div>
    );
  }
  if (user === false) {
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }
  return children;
};
