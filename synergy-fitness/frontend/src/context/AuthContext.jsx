import { createContext, useContext, useEffect, useState } from "react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const formatApiError = (detail, fallback = "Something went wrong. Please try again.") => {
  if (detail == null) return fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  if (typeof detail?.msg === "string") return detail.msg;
  return String(detail);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = checking, false = signed out

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : false))
      .then((data) => setUser(data || false))
      .catch(() => setUser(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(formatApiError(data.detail, "Incorrect email or password"));
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(formatApiError(data.detail));
    setUser(data);
    return data;
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
