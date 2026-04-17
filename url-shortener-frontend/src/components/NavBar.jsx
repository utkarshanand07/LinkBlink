import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, isAdmin } = useStoreContext(); 
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);

  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center sticky top-0 transition-all">
      <div className="lg:px-16 sm:px-8 px-5 w-full max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" onClick={() => setNavbarOpen(false)}>
          <h1 className="font-extrabold text-2xl text-black tracking-tight">
            LinkBlink.
          </h1>
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <ul
          className={`flex sm:gap-8 gap-6 sm:items-center sm:static absolute left-0 top-20 sm:shadow-none shadow-lg sm:border-none border-b border-gray-100 ${
            navbarOpen ? "h-fit pb-8 pt-4 opacity-100" : "h-0 opacity-0 sm:opacity-100 overflow-hidden"
          } transition-all duration-300 ease-in-out sm:h-fit bg-white sm:bg-transparent sm:w-auto w-full sm:flex-row flex-col px-6 sm:px-0 z-40`}
        >
          <li>
            <Link
              className={`text-sm font-medium transition-colors duration-200 ${
                path === "/" ? "text-black" : "text-gray-500 hover:text-black"
              }`}
              to="/"
              onClick={() => setNavbarOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`text-sm font-medium transition-colors duration-200 ${
                path === "/about" ? "text-black" : "text-gray-500 hover:text-black"
              }`}
              to="/about"
              onClick={() => setNavbarOpen(false)}
            >
              About
            </Link>
          </li>
          
          {token && (
            <li>
              <Link
                className={`text-sm font-medium transition-colors duration-200 ${
                  path === "/dashboard"
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                to="/dashboard"
                onClick={() => setNavbarOpen(false)}
              >
                Dashboard
              </Link>
            </li>
          )}

          <li>
            <Link
              className={`text-sm font-medium transition-colors duration-200 ${
                path === "/pricing" ? "text-black" : "text-gray-500 hover:text-black"
              }`}
              to="/pricing"
              onClick={() => setNavbarOpen(false)}
            >
              Pricing
            </Link>
          </li>

          {/* NEW: Admin Button strictly visible to Admins */}
          {isAdmin && (
            <li>
              <Link
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  path.startsWith("/admin")
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                to="/admin"
                onClick={() => setNavbarOpen(false)}
              >
                <span></span> Admin Panel
              </Link>
            </li>
          )}

          {/* Action Buttons */}
          <div className="sm:ml-4 flex flex-col sm:flex-row gap-4 sm:items-center mt-2 sm:mt-0">
            {!token ? (
              <Link to="/register" onClick={() => setNavbarOpen(false)}>
                <button className="w-full sm:w-auto bg-black text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-gray-800 transition-colors duration-200">
                  Sign Up
                </button>
              </Link>
            ) : (
              <button
                onClick={() => {
                  onLogOutHandler();
                  setNavbarOpen(false);
                }}
                className="w-full sm:w-auto bg-gray-100 text-black text-sm font-medium px-6 py-2.5 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Log Out
              </button>
            )}
          </div>
        </ul>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
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