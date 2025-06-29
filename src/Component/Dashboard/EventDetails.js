// components/EventDetails.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { deselectEvent } from '@/Redux/Reducer/eventSlice';

const EventDetails = () => {
  const dispatch = useDispatch();
  const { selectedEvent, isSidebarOpen } = useSelector(state => state.events);

  const handleClose = () => {
    dispatch(deselectEvent());
  };

  if (!selectedEvent) return null;

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl z-20 p-6 overflow-y-auto"
        >
          <button 
            onClick={handleClose}
            className="absolute top-4 left-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
              <p className="text-gray-500">
                Edition {selectedEvent.edition} • {selectedEvent.year}
              </p>
            </motion.div>

            <EventDetailSection title="Dates">
              <p>
                {new Date(selectedEvent.dates.start).toLocaleString()} -<br />
                {new Date(selectedEvent.dates.end).toLocaleString()}
              </p>
            </EventDetailSection>

            <EventDetailSection title="Location">
              <p>{selectedEvent.location.address}</p>
              <p>{selectedEvent.location.city}, {selectedEvent.location.country}</p>
              <a 
                href={selectedEvent.location.googleMapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on Google Maps
              </a>
            </EventDetailSection>

            <EventDetailSection title="Description">
              <p className="whitespace-pre-line">{selectedEvent.description}</p>
            </EventDetailSection>

            <EventDetailSection title="Website">
              <a 
                href={selectedEvent.websiteURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedEvent.websiteURL}
              </a>
            </EventDetailSection>

            <EventDetailSection title="Social Media">
              <div className="flex space-x-4">
                {Object.entries(selectedEvent.socialMediaLinks)
                  .filter(([_, url]) => url)
                  .map(([platform, url]) => (
                    <a 
                      key={platform} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline capitalize"
                    >
                      {platform}
                    </a>
                  ))
                }
              </div>
            </EventDetailSection>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EventDetailSection = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="border-t pt-4"
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-gray-700">{children}</div>
  </motion.div>
);

export default EventDetails;