import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Card from "../components/Card";
import { useStoreContext } from "../contextApi/ContextApi";
import GuestShortenBox from "../components/GuestShortenBox";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();

  const dashBoardNavigateHandler = () => {
    if (token) navigate("/dashboard");
    else navigate("/register");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-brand-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Aesthetic Orbs - Matched to Pricing Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-20 lg:pt-32 pb-12 relative z-10">
        
        {/* Centered Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32 w-full">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.2em] uppercase bg-white dark:bg-brand-900 border border-slate-200/60 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-sm">
              The Ultimate Link Tool
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-black text-slate-900 dark:text-white text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] mb-6 w-full"
          >
            Make every link count.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-medium"
          >
            Transform long, clunky URLs into powerful, trackable links in seconds. Simplify your sharing experience and manage your digital presence with ease.
          </motion.p>
          
          {/* Interactive Shorten Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full relative"
          >
            <GuestShortenBox />
          </motion.div>

          {/* Conspicuous Navigational Text Prompts */}
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
             className="mt-8 w-full"
          >
             {!token ? (
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                     Want permanent links and powerful analytics?{' '}
                     <button 
                        onClick={dashBoardNavigateHandler} 
                        className="text-slate-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 pb-0.5"
                     >
                         Create a free account.
                     </button>
                 </p>
             ) : (
                 <button 
                    onClick={dashBoardNavigateHandler} 
                    className="group flex items-center justify-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mx-auto"
                 >
                     <span className="border-b-2 border-transparent group-hover:border-blue-600 dark:group-hover:border-blue-400 pb-0.5 transition-colors">
                         Go to your Dashboard
                     </span>
                     <span className="group-hover:translate-x-1 transition-transform">➔</span>
                 </button>
             )}
          </motion.div>

        </div>

        {/* Features Section */}
        <div className="pt-20 pb-16 border-t border-slate-200/60 dark:border-slate-800/60">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-slate-900 dark:text-white font-black text-3xl md:text-4xl tracking-tight text-center mb-16 max-w-2xl mx-auto"
          >
            Built for individuals and teams who value efficiency.
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Simple Shortening" desc="Experience the ease of creating short, memorable URLs in just a few clicks. No clutter, no hassle." />
            <Card title="Powerful Analytics" desc="Track clicks, geographic data, and referral sources to perfectly optimize your marketing strategies." />
            <Card title="Enhanced Security" desc="Rest assured knowing all your shortened URLs are protected with industry-standard encryption." />
            <Card title="Fast and Reliable" desc="Enjoy lightning-fast redirects and high uptime. Your links will always be responsive." />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;