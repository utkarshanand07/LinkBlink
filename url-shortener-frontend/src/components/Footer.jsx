import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 z-40 relative">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl flex flex-col lg:flex-row lg:justify-between items-center gap-6">
        
        {/* Brand & Description */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-extrabold text-black tracking-tight mb-1">
            LinkBlink.
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Simplify your links. Share instantly.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400 font-medium mt-4 lg:mt-0">
          &copy; {new Date().getFullYear()} LinkBlink. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 mt-4 lg:mt-0">
          <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200" aria-label="Facebook">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200" aria-label="Twitter">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200" aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-black transition-colors duration-200" aria-label="LinkedIn">
            <FaLinkedin size={20} />
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;