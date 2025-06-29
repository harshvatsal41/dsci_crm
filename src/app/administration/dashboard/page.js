'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { EventApi } from '@/utilities/ApiManager';
import EventCard from '@/Component/Dashboard/EventCard';
import EventForm from '@/Component/Dashboard/EventForm';
import Modal from '@/Component/UI/Modal';
import { Button } from '@/Component/UI/TableFormat';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ open: false, data: null });
  const isEditMode = useRef(false);
  const dispatch = useDispatch();

  const fetchEvents = async () => {
    dispatch(setLoading(true));
    try {
      const response = await EventApi();
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.data);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    isEditMode.current = false;
    setModalState({ open: true, data: null });
  };

  const handleEditEvent = (event) => {
    isEditMode.current = true;
    setModalState({ open: true, data: event });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, data: null });
    isEditMode.current = false;
  };

  const handleEventSuccess = (newEvent) => {
    if (isEditMode.current) {
      setEvents(events.map(event => 
        event._id === newEvent._id ? newEvent : event
      ));
    } else {
      setEvents([...events, newEvent]);
    }
    handleCloseModal();
  };

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Dashboard</h1>
        <Button
          onClick={handleCreateEvent}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Create New Event
        </Button>
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
                onClick={() => handleEditEvent(event)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

        <EventForm 
          onSuccess={handleEventSuccess}
          onClose={handleCloseModal}
          eventData={modalState.data}
          isEditMode={isEditMode.current}
        />
    </section>
  );
}