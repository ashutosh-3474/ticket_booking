import React from "react";
import { Navigate } from "react-router-dom";
import  { jwtDecode }  from "jwt-decode"; // lightweight and browser-friendly

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  let user;
  try {
    user = jwtDecode(token); // only decodes payload, works in browser
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
