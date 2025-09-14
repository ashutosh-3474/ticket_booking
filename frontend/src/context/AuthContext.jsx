// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // correct import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      try {
        const decoded = jwtDecode(token); // decode JWT to get user details
        setUser(user);
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = ({ token , user }) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      console.error("Failed to decode token on login", err);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
