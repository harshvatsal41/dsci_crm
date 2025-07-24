'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SpeakerApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificSpeakerCard from '@/Component/SpecificEventDetails/Speaker/SpecificSpeakerCard';
import SpeakerForm from '@/Component/SpecificEventDetails/Speaker/SpeakerForm';
import { toast } from 'sonner';
import { FiSearch } from 'react-icons/fi';
import { userPermissions } from '@/Component/UserPermission';


export default function Speaker() {
    const { Id } = useParams();
    const [speakers, setSpeakers] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchField, setSearchField] = useState('name');
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);
    userPermissions();
    const permissions = useSelector((state) => state.menu.permissions);
    console.log(permissions);
    const onSuccess = () => {
        setFormOpen(false);
        fetchSpeakers();
        setEdit({ value: false, data: {} });
    };

    const onClose = () => {
        setFormOpen(false);
        setEdit({ value: false, data: {} });
    };

    const onDelete = () => {
        fetchSpeakers();
    };

    const fetchSpeakers = async () => {
        if (permissions?.speaker?.includes("read")===false){
            toast.error("You don't have permission to read this speaker");
            return;
        }
        dispatch(setLoading(true));
        try {
            const res = await SpeakerApi(null, "GET", { Id });
            if (res.statusCode === 200) {
                setSpeakers(res);
                toast.success(res.message || 'Speakers loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to fetch speakers');
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchSpeakers();
    }, [Id]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    // Filter speakers based on selected field
    const filteredSpeakers = {
        ...speakers,
        data: speakers.data.filter(sp => {
            const val = (sp[searchField] || '').toLowerCase();
            return val.includes(search.toLowerCase());
        })
    };

    return (
        <>
            {!isLoading && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 w-full">
                    <h1 className="text-2xl font-bold text-gray-800 flex-shrink-0">Speakers</h1>
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 items-stretch sm:items-center sm:justify-end w-full">
                        <select
                            value={searchField}
                            onChange={e => setSearchField(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                        >
                            <option value="name">Name</option>
                            <option value="organization">Organization</option>
                            <option value="position">Designation</option>
                        </select>
                        <div className="relative w-full sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FiSearch className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white w-full shadow-sm"
                                placeholder={`Search by ${searchField === 'position' ? 'designation' : searchField}...`}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => {
                                if (permissions?.speaker?.includes("create")===false){
                                    toast.error("You don't have permission to create this speaker");
                                    return;
                                }
                                setFormOpen(true)}}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add New Speaker
                        </button>
                    </div>
                    {/* Floating Add Button */}
                    <button 
                        onClick={() => {
                            if (permissions?.speaker?.includes("create")===false){
                                toast.error("You don't have permission to create this speaker");
                                return;
                            }
                            setFormOpen(true)}}
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl z-50"
                        aria-label="Add New Speaker"
                    >
                        +
                    </button>
                </div>
            )}
            {(formOpen || edit.value) && (
                <SpeakerForm 
                    edit={edit} 
                    onSuccess={onSuccess} 
                    onClose={onClose}
                    eventId={Id}
                />
            )}
           {(!formOpen && !edit.value) && <SpecificSpeakerCard
                onDelete={onDelete}
                setEdit={setEdit}
                data={filteredSpeakers}
                type="speaker"
            />}
        </>
    );
}