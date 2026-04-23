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

  // Tighter rounded-xl for inner elements
  const linkBaseStyle = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200";
  const getLinkStyle = (targetPath) => 
    path === targetPath 
      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50";

  return (
    <div className="sticky top-0 z-50 pt-4 sm:pt-6 px-4 sm:px-6 pb-4 w-full pointer-events-none transition-all duration-300">
      
      <div className="w-full max-w-6xl mx-auto pointer-events-auto relative">
        
        {/* Subtle Glow Orb */}
        <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-10 bg-blue-500/20 dark:bg-blue-400/10 blur-[40px] rounded-full -z-10 pointer-events-none transition-opacity duration-300"></div>

        {/* Rectangular Glass Navbar: Tighter rounded-2xl for a professional edge */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-black/40 rounded-2xl px-5 sm:px-6 py-3 flex justify-between items-center transition-all duration-300">
          
          {/* Logo Section */}
          <Link to="/" onClick={() => setNavbarOpen(false)} className="flex-shrink-0 pl-2">
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              LinkBlink.
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-1">
            <li><Link className={`${linkBaseStyle} ${getLinkStyle("/")}`} to="/">Home</Link></li>
            <li><Link className={`${linkBaseStyle} ${getLinkStyle("/about")}`} to="/about">About</Link></li>
            {token && <li><Link className={`${linkBaseStyle} ${getLinkStyle("/dashboard")}`} to="/dashboard">Dashboard</Link></li>}
            <li><Link className={`${linkBaseStyle} ${getLinkStyle("/pricing")}`} to="/pricing">Pricing</Link></li>
            
            {isAdmin && (
              <li>
                <Link className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${path.startsWith("/admin") ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/10"}`} to="/admin">
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Right Side: Actions & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 pr-1">
              {!token ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Log in
                  </Link>
                  <Link to="/register">
                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-95">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={onLogOutHandler}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  Log Out
                </button>
              )}
            </div>

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="md:hidden flex items-center justify-center p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {navbarOpen ? <RxCross2 className="text-xl" /> : <IoIosMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Floating Mobile Menu Card */}
        <div className={`absolute top-[calc(100%+0.75rem)] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 p-6 flex flex-col gap-2 md:hidden transition-all duration-300 origin-top overflow-hidden ${navbarOpen ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
            <Link className={`${linkBaseStyle} ${getLinkStyle("/")}`} to="/" onClick={() => setNavbarOpen(false)}>Home</Link>
            <Link className={`${linkBaseStyle} ${getLinkStyle("/about")}`} to="/about" onClick={() => setNavbarOpen(false)}>About</Link>
            {token && <Link className={`${linkBaseStyle} ${getLinkStyle("/dashboard")}`} to="/dashboard" onClick={() => setNavbarOpen(false)}>Dashboard</Link>}
            <Link className={`${linkBaseStyle} ${getLinkStyle("/pricing")}`} to="/pricing" onClick={() => setNavbarOpen(false)}>Pricing</Link>
            
            {isAdmin && (
              <Link className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${path.startsWith("/admin") ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`} to="/admin" onClick={() => setNavbarOpen(false)}>
                Admin Panel
              </Link>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800 my-3 pt-5 flex flex-col gap-3">
              {!token ? (
                <>
                  <Link to="/login" onClick={() => setNavbarOpen(false)} className="w-full text-center py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setNavbarOpen(false)}>
                    <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { onLogOutHandler(); setNavbarOpen(false); }}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-all active:scale-95"
                >
                  Log Out
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;