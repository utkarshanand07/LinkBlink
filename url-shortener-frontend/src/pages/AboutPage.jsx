import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-brand-950 transition-colors duration-300 relative overflow-hidden pb-24">
      
      {/* Background Aesthetic Orb - Matched to Pricing Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-16 pt-20 lg:pt-32 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.2em] uppercase bg-white dark:bg-brand-900 border border-slate-200/60 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 shadow-sm">
              Our Mission
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="font-black text-slate-900 dark:text-white text-4xl md:text-6xl tracking-tight mb-6"
          >
            We simplify the internet.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Long, ugly URLs are terrible for branding and impossible to remember. We built LinkBlink to give creators, marketers, and enterprises the tools they need to share cleanly and track confidently.
          </motion.p>
        </div>

        {/* Glassmorphic Content Cards */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="bg-white/80 dark:bg-brand-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-glass-dark transition-all duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Precision Data</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    We believe data should be beautiful. Instead of overwhelming spreadsheets, we provide crisp, actionable graphs so you can see exactly where your audience is coming from.
                </p>
            </div>

            <div className="bg-white/80 dark:bg-brand-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-glass-dark transition-all duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Built to Scale</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Whether you are shortening 10 links for a weekend project or 10,000 links for an enterprise marketing campaign, our infrastructure handles redirects in milliseconds.
                </p>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;