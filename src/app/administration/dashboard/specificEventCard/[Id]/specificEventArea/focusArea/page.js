'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {BroadFocusAreaApi} from '@/utilities/ApiManager';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificEventCard from '@/Component/SpecificEventDetails/FocusArea/SpecificEventCard';
import FocusAreaForm from '@/Component/SpecificEventDetails/FocusArea/FocusAreaForm';
import {toast} from 'sonner';
import {userPermissions} from '@/Component/UserPermission';


export default function FocusArea() {
    const {Id} = useParams();
    const [focusArea, setFocusArea] = useState({ data: [] }); // Initialize with proper structure
    const [edit, setEdit] = useState({value:Boolean(false), data:{}});
    const [formOpen, setFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);
    userPermissions();
    const permissions = useSelector((state) => state.menu.permissions);
    const onSuccess = () => {
        setFormOpen(false);
        fetchFocusArea();
        setEdit({value:Boolean(false), data:{}});
    };


    const onClose = () => {
        setFormOpen(false);
        setEdit({value:Boolean(false), data:{}});
    };

    const onDelete= ()=>{
       fetchFocusArea();
    }
 
    const fetchFocusArea = async () => {
        if (permissions?.focusArea?.includes("read")===false){ 
            toast.error("You don't have permission to read this focus area");
            return;
        }
        
        dispatch(setLoading(true));
        const res = await BroadFocusAreaApi(null, "GET", {Id});
        if(res.statusCode === 200){
            setFocusArea(res);
            toast.success(res.message || 'Operation Success');
        }
        dispatch(setLoading(false));
    };


    useEffect(() => {
      
        fetchFocusArea();
    }, [Id]);
    
    if(isLoading){
        return <DashboardLoading />;
    }

    // Filtered focus areas by name
    const filteredFocusAreas = focusArea.data.filter(fa =>
        fa?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {!isLoading && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 w-full font-sans">
                <h1 className="text-2xl font-bold text-gray-800 flex-shrink-0">Focus Area</h1>
                <div className="flex flex-col sm:flex-row gap-2 flex-1 items-stretch sm:items-center sm:justify-end w-full">
                    <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <FiSearch className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white w-full shadow-sm"
                            placeholder="Search by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            if (permissions?.focusArea?.includes("create")===false){ 
                                toast.error("You don't have permission to create this focus area");
                                return;
                            }
                            setFormOpen(true)
                        }}
                        className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
                    >
                        Add New
                    </button>
                </div>
                {/* Floating Add Button */}
                <button 
                    onClick={() => {
                        if (permissions?.focusArea?.includes("create")===false){ 
                            toast.error("You don't have permission to create this focus area");
                            return;
                        }
                        setFormOpen(true)}}
                    className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl z-50"
                    aria-label="Add New Focus Area"
                >
                    +
                </button>
            </div>
            )}
            {(formOpen ||  edit.value) && <FocusAreaForm edit={edit} onSuccess={onSuccess} onClose={onClose}/>}
           {(!formOpen && !edit.value) && <SpecificEventCard
                onDelete={onDelete} 
                setEdit={setEdit} 
                data={{ ...focusArea, data: filteredFocusAreas }} 
                type="focusArea"
            />}
          
        </>
    );  
}