import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, desc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white border border-gray-100 flex flex-col p-8 gap-4 rounded-2xl hover:shadow-2xl hover:shadow-gray-100/50 hover:border-gray-200 transition-all duration-300"
    >
      <h1 className="text-black text-xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-gray-500 text-base leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

export default Card;