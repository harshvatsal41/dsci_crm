'use client';
import { useEffect, useState } from 'react';
import EventCard from '@/Component/Dashboard/EventCard';
import EventForm from '@/Component/Dashboard/EventForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/data/eventoutreach');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setShowForm(false);
  };

  const handleCreateEvent = () => {
    setShowForm(true);
    setSelectedEvent(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-64"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      {showForm ? (
        <EventForm 
          onClose={handleFormClose} 
          onEventCreated={handleEventCreated}
        />
      ) : selectedEvent ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{selectedEvent.title}</h1>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to events
            </button>
          </div>
          {/* Display selected event details */}
          <div className="space-y-4">
            <p><span className="font-semibold">Dates:</span> {selectedEvent.dates.start} to {selectedEvent.dates.end}</p>
            <p><span className="font-semibold">Location:</span> {selectedEvent.location.city}, {selectedEvent.location.country}</p>
            <p className="whitespace-pre-line">{selectedEvent.description}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Event Dashboard</h1>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Event
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found. Create your first event!</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {events.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={() => handleCardClick(event)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}