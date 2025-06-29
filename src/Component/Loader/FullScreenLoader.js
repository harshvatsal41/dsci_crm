"use client";

import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const FullScreenLoader = ({ loading = false, message = "Loading..." }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center transition-opacity duration-500 ${
        loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="text-blue-600 text-5xl"
      >
        <FaSpinner />
      </motion.div>

      <motion.p
        className="mt-4 text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default FullScreenLoader;
