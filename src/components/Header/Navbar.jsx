import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../utils/contexts/AuthProvider";
import api from "../../../config/axiosConfig";

import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../utils/contexts/AuthProvider";
import api from "../../../config/axiosConfig";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, user } = useContext(AuthContext);
  const navRef = useRef(null);

  const handleLogout = async () => {
    try {
      await api.post("/subscribe-services/unsubscribe");
    } catch (error) {
      console.error("Unsubscribe error:", error);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                  dispozz
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block -mt-0.5">
                  Expiry Tracker
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate("/")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/add-product")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/add-product")
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Add Product
              </button>
            </nav>
          </div>

          {/* Right Section: Add CTA, User Chip & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/add-product")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow active:scale-98"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>New Item</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {/* User Profile Chip */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-semibold">
                {userInitial}
              </div>
              <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                {user?.name || "User"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 mb-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
                {userInitial}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
                <p className="text-[11px] text-slate-500">Signed in</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                isActive("/") ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/add-product");
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                isActive("/add-product") ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600"
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
