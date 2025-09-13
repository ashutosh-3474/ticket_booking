// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setAuthToken(parsed.token);
    }
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
