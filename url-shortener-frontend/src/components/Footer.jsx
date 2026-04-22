import React from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-brand-950 border-t border-slate-200/60 dark:border-slate-800/60 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">LinkBlink.</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Making every link count.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold">
          © {new Date().getFullYear()} LinkBlink. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6">
          <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <FaGithub size={20} />
          </a>
          <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;