import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, desc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/80 dark:bg-brand-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 flex flex-col p-8 gap-4 rounded-[2rem] hover:shadow-premium dark:hover:shadow-glass-dark hover:-translate-y-1 transition-all duration-300"
    >
      <h1 className="text-slate-900 dark:text-white text-xl font-black tracking-tight">
        {title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

export default Card;