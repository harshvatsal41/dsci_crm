'use client';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-2 flex items-center justify-center p-4"
        >
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(4px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {children}
            </div>

            {/* Subtle footer (optional) */}
            {/* <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                Confirm
              </button>
            </div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;