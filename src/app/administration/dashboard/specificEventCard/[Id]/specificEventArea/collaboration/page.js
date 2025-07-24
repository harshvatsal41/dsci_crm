'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CollaborationApi, ColabCategoryApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificCollaborationCard from '@/Component/SpecificEventDetails/Collaboration/SpecificCollaborationCard';
import CollaborationForm from '@/Component/SpecificEventDetails/Collaboration/CollaborationForm';
import SubCollaborationForm from '@/Component/SpecificEventDetails/Collaboration/SubCollabForm';
import SubCollaborationCard from '@/Component/SpecificEventDetails/Collaboration/SubCollabCard';
import { toast } from 'sonner';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { userPermissions } from '@/Component/UserPermission';

export default function Collaboration() {
    const { Id } = useParams();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);
    userPermissions();
    const permissions = useSelector((state) => state.menu.permissions);
    console.log(permissions);
    // State management
    const [state, setState] = useState({
        collaborations: { data: [] },
        subCollaborations: { data: [] },
        search: '',
        forms: {
            main: { open: false, edit: { value: false, data: {} } },
            sub: { open: false, edit: { value: false, data: {} } }
        }
    });

    // Destructure state for easier access
    const { collaborations, subCollaborations, search, forms } = state;

    // Memoized filtered collaborations
    const filteredCollaborations = useMemo(() => {
        if (!collaborations?.data || !Array.isArray(collaborations.data)) {
            return { data: [] };
        }

        if (!search.trim()) return collaborations;

        const searchTerm = search.toLowerCase().trim();
        return {
            ...collaborations,
            data: collaborations.data.filter(collaboration => {
                const fieldsToSearch = [
                    collaboration?.title?.toLowerCase(),
                    collaboration?.about?.toLowerCase(),
                    collaboration?.description?.toLowerCase(),
                    collaboration?.subCategory?.title?.toLowerCase()
                ].filter(Boolean);

                return fieldsToSearch.some(field => field.includes(searchTerm));
            })
        };
    }, [collaborations, search]);

    // Fetch data function
    const fetchData = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const [colabRes, subCollabRes] = await Promise.all([
                CollaborationApi(null, "GET", { Id }),
                ColabCategoryApi(null, "GET", { Id })
            ]);


            const parseData = (res) => ({
                data: Array.isArray(res.data) ? res.data : 
                      Array.isArray(res.data?.data) ? res.data.data : 
                      Array.isArray(res.data?.collaborations) ? res.data.collaborations : []
            });

            setState(prev => ({
                ...prev,
                collaborations: parseData(colabRes),
                subCollaborations: parseData(subCollabRes)
            }));

            toast.success('Data loaded successfully');
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            dispatch(setLoading(false));
        }
    }, [Id, dispatch]);

    // CRUD Operations
    const handleDelete = async (type, id) => {
        
        dispatch(setLoading(true));
        try {
            const api = type === 'main' ? CollaborationApi : ColabCategoryApi;
            const res = await api({ }, "DEL", { Id: id });

            if (res.statusCode === 200 || res.statusCode === 203 || res.status === "success") {
                toast.success(`${type === 'main' ? 'Collaboration' : 'Category'} deleted successfully`);
                fetchData();
            } else {
                toast.error(res.message || `Failed to delete ${type === 'main' ? 'collaboration' : 'category'}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(`Failed to delete ${type === 'main' ? 'collaboration' : 'category'}`);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleFormSuccess = (type) => {
        setState(prev => ({
            ...prev,
            forms: {
                ...prev.forms,
                [type]: { open: false, edit: { value: false, data: {} } }
            }
        }));
        fetchData();
        toast.success('Operation completed successfully');
    };

    const handleFormToggle = (type, editData = null) => {
        setState(prev => ({
            ...prev,
            forms: {
                ...prev.forms,
                [type]: {
                    open: !prev.forms[type].open,
                    edit: editData ? { value: true, data: editData } : { value: false, data: {} }
                }
            }
        }));
    };

    // Initial data fetch
    useEffect(() => {
        if (Id) fetchData();
    }, [Id, fetchData]);

    if (isLoading) return <DashboardLoading />;

    return (
        <div className=" max-h-screen overflow-y-auto ">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Collaborations</h1>
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
                            onChange={e => setState(prev => ({ ...prev, search: e.target.value }))}
                        />
                        {search && (
                            <button
                                onClick={() => setState(prev => ({ ...prev, search: '' }))}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    <button 
                        onClick={() => {permissions?.colab?.includes("create")===true ? handleFormToggle('main') : toast.error("You don't have permission to add collaboration")}}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Collaboration
                    </button>

                    <button 
                        onClick={() => {permissions?.colab?.includes("create")===true ? handleFormToggle('sub') : toast.error("You don't have permission to add sub category")}}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Sub Category
                    </button>
                </div>
            </div>

            {/* Sub Category Section */}
            <div>
                <p className="text-gray-600 mt-1">Manage event sub categories</p>
                <SubCollaborationCard  
                    data={subCollaborations} 
                    onDelete={(id) => handleDelete('sub', id)} 
                    setEdit={(data) => handleFormToggle('sub', data)} 
                />
            </div>
            <p className="text-gray-600 ">Manage event collaborations and partnerships</p>

            {/* Form Modals */}
            {forms.main.open && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full ">
                        <CollaborationForm 
                            edit={forms.main.edit} 
                            onSuccess={() => handleFormSuccess('main')} 
                            onClose={() => handleFormToggle('main')}
                            eventId={Id}
                        />
                    </div>
                </div>
            )}

            {forms.sub.open && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full ">
                        <SubCollaborationForm 
                            edit={forms.sub.edit} 
                            onSuccess={() => handleFormSuccess('sub')} 
                            onClose={() => handleFormToggle('sub')}
                            eventId={Id}
                        />
                    </div>
                </div>
            )}
           
            {/* Main Collaborations Table */}
            {!forms.main.open && !forms.main.edit.value && (
                <SpecificCollaborationCard
                    data={filteredCollaborations}
                    onDelete={(id) => handleDelete('main', id)}
                    setEdit={(data) => handleFormToggle('main', data)}
                />
            )}

            {/* Floating Add Button for Mobile */}
            <button 
                onClick={() => handleFormToggle('main')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-2xl z-40 sm:hidden"
                aria-label="Add New Collaboration"
            >
                <FiPlus className="w-6 h-6" />
            </button>
        </div>
    );
}