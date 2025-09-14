import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) return null; // wait until auth state is ready

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

        {/* Auth Links */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <Link
              to="/login"
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              {/* Avatar button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-600 font-bold shadow hover:bg-gray-100 transition"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 border-b">{user.name}</div>
                  <Link
                    to="/history"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    History
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
