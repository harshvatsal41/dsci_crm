'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { EventApi } from '@/utilities/ApiManager';
import EventCard from '@/Component/Dashboard/EventCard';
import EventForm from '@/Component/Dashboard/EventForm';
import Modal from '@/Component/UI/Modal';
import { Button } from '@/Component/UI/TableFormat';
import DashboardLoading from './loading';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [modalState, setModalState] = useState({ open: Boolean(false), data: null });
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.menu.loading);

  const fetchEvents = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await EventApi(null, "Get");
      if (!response.ok) toast.error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleView = (event) => {
    router.push(`/administration/dashboard/specificEventCard/${event._id}`);
  };



  const handleDelete = (event) => {
    console.log(event);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEditEvent = (event) => {
    const editData = { ...event, editMode: true };
    console.log(editData);
    setModalState({ open: Boolean(true), data: editData });
  };

  const handleCloseModal = () => {
    setModalState({ open: Boolean(false), data: null });
  };

  const onSuccess = () => {
    fetchEvents();
    handleCloseModal();
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <section className="p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Dashboard</h1>
        <Button
          onClick={() => setModalState({ open: Boolean(true), data: null })}
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
                key={`event-${event._id}`}
                event={event}
                onView={handleView}
                onEdit={handleEditEvent}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {modalState.open && <EventForm
        onSuccess={onSuccess}
        onClose={handleCloseModal}
        eventData={modalState.data}
      />}
    </section>
  );
}