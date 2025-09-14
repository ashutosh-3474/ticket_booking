// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- new loading state

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem("auth");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAuthToken(parsed.token);
          // Optional: fetch latest user data from backend
          const res = await axios.get("/api/auth/me"); // your endpoint to get logged-in user
          setUser(res.data.user);
        } catch (err) {
          console.error("Failed to fetch user", err);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = ({ user, token }) => {
    localStorage.setItem("auth", JSON.stringify({ user, token }));
    setUser(user);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
