'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { CollaborationApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificCollaborationCard from '@/Component/SpecificEventDetails/Collaboration/SpecificCollaborationCard';
import CollaborationForm from '@/Component/SpecificEventDetails/Collaboration/CollaborationForm';
import { toast } from 'sonner';
import { FiSearch, FiPlus } from 'react-icons/fi';

export default function Collaboration() {
    const { Id } = useParams();
    const [collaborations, setCollaborations] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const onSuccess = () => {
        setFormOpen(false);
        fetchCollaborations();
        setEdit({ value: false, data: {} });
        toast.success('Operation completed successfully');
    };

    const onClose = () => {
        setFormOpen(false);
        setEdit({ value: false, data: {} });
    };

    const onDelete = async (collaborationId) => {
        try {
            dispatch(setLoading(true));
            const res = await CollaborationApi({ collaborationId }, "DELETE", { Id });
            if (res.statusCode === 200 || res.statusCode === 203 || res.status === "success") {
                toast.success('Collaboration deleted successfully');
                fetchCollaborations();
            } else {
                toast.error(res.message || 'Failed to delete collaboration');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete collaboration');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchCollaborations = async () => {
        dispatch(setLoading(true));
        try {
            const res = await CollaborationApi(null, "GET", { Id });
            if (res.statusCode === 200 || res.statusCode === 203 || res.status === "success") {
                const collaborationData = {
                    data: Array.isArray(res.data) ? res.data : 
                          Array.isArray(res.data?.data) ? res.data.data : 
                          Array.isArray(res.data?.collaborations) ? res.data.collaborations : 
                          []
                };
                setCollaborations(collaborationData);
                toast.success(res.message || 'Collaborations loaded successfully');
            } else {
                setCollaborations({ data: [] });
                toast.error(res.message || 'Failed to fetch collaborations');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setCollaborations({ data: [] });
            toast.error('Failed to fetch collaborations');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (Id) {
            fetchCollaborations();
        }
    }, [Id]);

    // Filter collaborations by name, organization or role
    const filteredCollaborations = useMemo(() => {
        if (!collaborations?.data || !Array.isArray(collaborations.data)) {
            return { data: [] };
        }

        if (!search.trim()) {
            return collaborations;
        }

        const filtered = collaborations.data.filter(collaboration => {
            const title = collaboration?.title?.toLowerCase() || '';
            const about = collaboration?.about?.toLowerCase() || '';
            const description = collaboration?.description?.toLowerCase() || '';
            const category = collaboration?.subCategory?.title?.toLowerCase() || '';
            const searchTerm = search.toLowerCase().trim();
            
            return title.includes(searchTerm) || 
                   about.includes(searchTerm) || 
                   description.includes(searchTerm) ||
                   category.includes(searchTerm);
        });

        return { ...collaborations, data: filtered };
    }, [collaborations, search]);

    const handleAddNew = () => {
        setEdit({ value: false, data: {} });
        setFormOpen(true);
    };

    console.log('Collaborations state:', collaborations);
    console.log('Filtered collaborations:', filteredCollaborations);

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Collaborations</h1>
                    <p className="text-gray-600 mt-1">
                        Manage event collaborations and partnerships
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 flex-1 items-stretch sm:items-center sm:justify-end max-w-md">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <FiSearch className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white w-full shadow-sm text-sm placeholder-gray-500"
                            placeholder="Search collaborations..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    {/* Add New Button */}
                    <button 
                        onClick={handleAddNew}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Collaboration
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">
                        {collaborations?.data?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Total Collaborations</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">
                        {filteredCollaborations?.data?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Filtered Results</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">
                        {new Set(collaborations?.data?.map(c => c.subCategory?.title).filter(Boolean)).size || 0}
                    </div>
                    <div className="text-sm text-gray-500">Categories</div>
                </div>
            </div>

            {/* Form Modal */}
            {(formOpen || edit.value) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <CollaborationForm 
                            edit={edit} 
                            onSuccess={onSuccess} 
                            onClose={onClose}
                            eventId={Id}
                        />
                    </div>
                </div>
            )}

            {/* Table Section */}
            {!formOpen && !edit.value && (
                <SpecificCollaborationCard
                    data={filteredCollaborations}
                    onDelete={onDelete}
                    setEdit={setEdit}
                />
            )}

            {/* Floating Add Button for Mobile */}
            <button 
                onClick={handleAddNew}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-2xl z-40 sm:hidden"
                aria-label="Add New Collaboration"
            >
                <FiPlus className="w-6 h-6" />
            </button>
        </div>
    );
}