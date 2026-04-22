import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaSun, FaMoon } from "react-icons/fa";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, isAdmin, theme, toggleTheme } = useStoreContext(); 
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);

  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
  };

  const linkBaseStyle = "text-sm font-semibold transition-colors duration-200";
  const getLinkStyle = (targetPath) => 
    path === targetPath 
      ? "text-slate-900 dark:text-white" 
      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";

  return (
    // Premium Glassmorphism wrapper that adapts to light/dark
    <div className="h-20 bg-white/70 dark:bg-brand-950/70 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 z-50 flex items-center sticky top-0 transition-all duration-300">
      <div className="lg:px-16 sm:px-8 px-5 w-full max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" onClick={() => setNavbarOpen(false)}>
          <h1 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">
            LinkBlink.
          </h1>
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <ul
          className={`flex sm:gap-8 gap-6 sm:items-center sm:static absolute left-0 top-20 sm:shadow-none shadow-lg sm:border-none border-b border-slate-200 dark:border-slate-800 ${
            navbarOpen ? "h-fit pb-8 pt-4 opacity-100" : "h-0 opacity-0 sm:opacity-100 overflow-hidden"
          } transition-all duration-300 ease-in-out sm:h-fit bg-white dark:bg-brand-950 sm:bg-transparent sm:dark:bg-transparent w-full sm:w-auto flex-col sm:flex-row px-6 sm:px-0 z-40`}
        >
          <li><Link className={`${linkBaseStyle} ${getLinkStyle("/")}`} to="/" onClick={() => setNavbarOpen(false)}>Home</Link></li>
          <li><Link className={`${linkBaseStyle} ${getLinkStyle("/about")}`} to="/about" onClick={() => setNavbarOpen(false)}>About</Link></li>
          
          {token && (
            <li><Link className={`${linkBaseStyle} ${getLinkStyle("/dashboard")}`} to="/dashboard" onClick={() => setNavbarOpen(false)}>Dashboard</Link></li>
          )}

          <li><Link className={`${linkBaseStyle} ${getLinkStyle("/pricing")}`} to="/pricing" onClick={() => setNavbarOpen(false)}>Pricing</Link></li>

          {/* Admin Button strictly visible to Admins */}
          {isAdmin && (
            <li>
              <Link
                className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 ${
                  path.startsWith("/admin") ? "text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                }`}
                to="/admin"
                onClick={() => setNavbarOpen(false)}
              >
                Admin Panel
              </Link>
            </li>
          )}

          {/* Action Area: Theme Toggle & Auth Buttons */}
          <div className="sm:ml-4 flex flex-col sm:flex-row gap-4 sm:items-center mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>

            {!token ? (
              <Link to="/register" onClick={() => setNavbarOpen(false)}>
                <button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-95">
                  Sign Up
                </button>
              </Link>
            ) : (
              <button
                onClick={() => {
                  onLogOutHandler();
                  setNavbarOpen(false);
                }}
                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Log Out
              </button>
            )}
          </div>
        </ul>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {navbarOpen ? (
            <RxCross2 className="text-2xl" />
          ) : (
            <IoIosMenu className="text-2xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;