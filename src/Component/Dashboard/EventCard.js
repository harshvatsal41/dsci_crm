// components/Dashboard/EventCard.jsx
'use client';
import { motion } from 'framer-motion';

const EventCard = ({ event, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
        <h3 className="text-xl font-bold text-center px-4">{event.title}</h3>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-2">
          {new Date(event.dates.start).toLocaleDateString()} - {new Date(event.dates.end).toLocaleDateString()}
        </p>
        <p className="text-gray-700 text-sm line-clamp-2">{event.description}</p>
      </div>
    </motion.div>
  );
};

export default EventCard;