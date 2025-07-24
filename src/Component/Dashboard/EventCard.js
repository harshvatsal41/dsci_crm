'use client';
import { motion } from 'framer-motion';
import { Button } from '@/Component/UI/TableFormat';
import { FiCalendar, FiEye, FiEdit2 } from 'react-icons/fi';
import { userPermissions } from '@/Component/UserPermission';
import { useSelector } from 'react-redux';
import { permissions } from '@/Redux/Reducer/menuSlice';
import { toast } from 'sonner';
const EventCard = ({ event, onView, onEdit }) => {
  userPermissions();
  const permissions = useSelector((state) => state.menu.permissions);

  const handleAction = (e, action) => {
    e.stopPropagation();
    action(event);
  };
  if (!permissions?.event?.includes("read")) {
    toast.error("You don't have permission to view this event");
    return;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)'
      }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 15
      }}
      className="relative flex flex-col h-full bg-white rounded-xl border border-gray-100 overflow-hidden group"
    >
      {/* Shine overlay (hidden by default) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ 
            opacity: 1,
            scale: 1.2,
            transition: { duration: 0.4 }
          }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-blue-100/10 to-transparent pointer-events-none"
        />
      </div>

      {/* Inner glow effect */}
      <motion.div
        whileHover={{ 
          boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
          transition: { duration: 0.3 }
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Header with gradient background */}
      <div className="relative h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6 z-1">
        <h3 className="text-xl font-semibold text-gray-800 text-center line-clamp-2">
          {event.title}
        </h3>
      </div>

      {/* Content area */}
      <div className="relative flex flex-col flex-grow p-5 z-1">
        {/* Date information */}
        <div className="flex items-center text-gray-500 mb-4">
          <FiCalendar className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">
            {new Date(event.dates.start).toLocaleDateString()} - {new Date(event.dates.end).toLocaleDateString()}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex justify-end space-x-2">
          <Button 
            size="sm"
            variant="outline"
            icon={FiEye}
            onClick={(e) => handleAction(e, onView)}
            className="group-hover:bg-blue-50/50 transition-colors"
          >
            View
          </Button>
          <Button 
            size="sm"
            variant="primary"
            icon={FiEdit2}
            onClick={(e) => handleAction(e, onEdit)}
            className="group-hover:bg-blue-700 transition-colors"
          >
            Edit
          </Button>
          {/* <Button 
            size="sm"
            variant="danger"
            icon={FiTrash2}
            onClick={(e) => handleAction(e, onDelete)}
            className="group-hover:bg-red-700 transition-colors"
          >
            Delete
          </Button> */}
        </div>
      </div>
    </motion.article>
  );
};

export default EventCard;