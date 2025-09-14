// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { setAuthToken } from "../services/api";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setAuthToken(parsed.token);
      } catch (err) {
        console.error("Failed to parse auth from localStorage", err);
        setUser(null);
      }
    }
    setLoading(false);
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
