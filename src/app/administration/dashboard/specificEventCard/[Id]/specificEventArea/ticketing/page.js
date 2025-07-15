'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TicketApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificTicketCard from '@/Component/SpecificEventDetails/Ticketing/SpecificTicketCard';
import TicketForm from '@/Component/SpecificEventDetails/Ticketing/TicketingForm';
import { toast } from 'react-toastify';
import { FiSearch } from 'react-icons/fi';

export default function Ticketing() {
    const { Id } = useParams();
    const [tickets, setTickets] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const onSuccess = () => {
        setFormOpen(false);
        fetchTickets();
        setEdit({ value: false, data: {} });
    };

    const onClose = () => {
        setFormOpen(false);
        setEdit({ value: false, data: {} });
    };

    const onDelete = () => {
        fetchTickets();
    };

    const fetchTickets = async () => {
        dispatch(setLoading(true));
        try {
            const res = await TicketApi(null, "GET", { Id });
            if (res.statusCode === 200 || res.statusCode === 203 || res.status === "success") {
                setTickets(res);
                toast.success(res.message || 'Tickets loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to fetch tickets');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [Id]);

    // Filter tickets by name, type or price
    const filteredTickets = {
        ...tickets,
        data: tickets.data.filter(ticket => {
            const name = ticket.name?.toLowerCase() || '';
            const type = ticket.type?.toLowerCase() || '';
            const price = ticket.price?.toString() || '';
            const s = search.toLowerCase();
            return name.includes(s) || type.includes(s) || price.includes(s);
        })
    };

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <>
            {!isLoading && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 w-full">
                    <h1 className="text-2xl font-bold text-gray-800 flex-shrink-0">Tickets</h1>
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 items-stretch sm:items-center sm:justify-end w-full">
                        <div className="relative w-full sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FiSearch className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white w-full shadow-sm"
                                placeholder="Search by name, type or price..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setFormOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create New Ticket
                        </button>
                    </div>
                    {/* Floating Add Button */}
                    <button 
                        onClick={() => setFormOpen(true)}
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl z-50"
                        aria-label="Create New Ticket"
                    >
                        +
                    </button>
                </div>
            )}
            {(formOpen || edit.value) && (
                <TicketForm 
                    edit={edit} 
                    onSuccess={onSuccess} 
                    onClose={onClose}
                    eventId={Id}
                />
            )}
            {(!formOpen && !edit.value) && <SpecificTicketCard
                onDelete={onDelete}
                setEdit={setEdit}
                data={filteredTickets}
                type="ticket"
            />}
        </>
    );
}