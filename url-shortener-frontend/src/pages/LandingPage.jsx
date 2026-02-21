import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Card from "../components/Card";
import { useStoreContext } from "../contextApi/ContextApi";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();

  const dashBoardNavigateHandler = () => {
    // If user is logged in, go to dashboard. Otherwise, prompt them to sign up.
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-20 lg:pt-32 pb-12">
        
        {/* Centered Hero Section (No Image) */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32">
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-extrabold text-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[1.05] mb-6 w-full"
          >
            Make every link count.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
          >
            Transform long, clunky URLs into powerful, trackable links in seconds. Simplify your sharing experience and manage your digital presence with ease.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={dashBoardNavigateHandler}
              className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Manage Links
            </button>
            <button
              onClick={dashBoardNavigateHandler}
              className="w-full sm:w-auto bg-white text-black border border-gray-200 px-8 py-3.5 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Create Short Link
            </button>
          </motion.div>
        </div>

        {/* Features / Trusted By Section */}
        <div className="pt-16 pb-16 border-t border-gray-100">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-black font-bold text-3xl md:text-4xl tracking-tight text-center mb-12 max-w-2xl mx-auto"
          >
            Built for individuals and teams who value efficiency.
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              title="Simple Shortening"
              desc="Experience the ease of creating short, memorable URLs in just a few clicks. No clutter, no hassle."
            />
            <Card
              title="Powerful Analytics"
              desc="Track clicks, geographic data, and referral sources to perfectly optimize your marketing strategies."
            />
            <Card
              title="Enhanced Security"
              desc="Rest assured knowing all your shortened URLs are protected with industry-standard encryption."
            />
            <Card
              title="Fast and Reliable"
              desc="Enjoy lightning-fast redirects and high uptime. Your links will always be responsive."
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;