import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-white tracking-wide hover:text-gray-200 transition"
        >
          🎬 MovieApp
        </Link>

        {/* Links */}
        <div className="space-x-4 flex items-center">
          <Link
            to="/"
            className="text-white hover:bg-white hover:text-blue-600 px-4 py-2 rounded-lg transition"
          >
            Home
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Signup
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => logout()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
