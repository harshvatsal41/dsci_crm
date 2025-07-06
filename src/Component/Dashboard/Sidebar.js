// components/Dashboard/Sidebar.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import EventDetails from './EventDetails';

const Sidebar = ({ isOpen, onClose }) => {
  const { selectedEvent } = useSelector(state => state.events);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#6610f2] shadow-lg z-50 border-l"
        >
          <div className="p-6 h-full overflow-y-auto">
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 bg-[#6610f2] p-2 rounded-full hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {selectedEvent ? (
              <EventDetails event={selectedEvent} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Select an event to view details</p>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;