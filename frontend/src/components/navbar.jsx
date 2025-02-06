import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Trophy, Plus, Home, LogIn, User, BarChart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is logged in and if they're an admin
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const admin = localStorage.getItem("isAdmin") === "true";
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
    };

    checkLoginStatus();

    // Listen for storage changes to update the navbar dynamically
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 backdrop-blur-md bg-black/20"
    >
      <Link to="/" className="text-2xl font-bold text-white">
        Treasure Hunt
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    location.pathname === "/admin" ? "bg-purple-600" : "bg-white/10 hover:bg-white/20"
                  } text-white transition-colors`}
                >
                  <BarChart className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/add-question"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    location.pathname.includes("add-question") ? "bg-purple-600" : "bg-white/10 hover:bg-white/20"
                  } text-white transition-colors`}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Link>
              </>
            ) : (
              <Link
                to="/game"
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  location.pathname === "/game" ? "bg-purple-600" : "bg-white/10 hover:bg-white/20"
                } text-white transition-colors`}
              >
                <Home className="w-4 h-4" />
                Game
              </Link>
            )}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-white transition-colors"
            >
              <User className="w-4 h-4" />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
