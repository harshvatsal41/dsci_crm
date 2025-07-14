'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {BroadFocusAreaApi} from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificEventCard from '@/Component/SpecificEventDetails/FocusArea/SpecificEventCard';
import FocusAreaForm from '@/Component/SpecificEventDetails/FocusArea/FocusAreaForm';
import { toast } from 'react-toastify';


export default function FocusArea() {
    const {Id} = useParams();
    const [focusArea, setFocusArea] = useState({ data: [] }); // Initialize with proper structure
    const [edit, setEdit] = useState({value:Boolean(false), data:{}});
    const [formOpen, setFormOpen] = useState(false);
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

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

    return (
        <>
            {!isLoading && (
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-gray-800">Focus Area</h1>
                <div>
                    
                <button 
                    onClick={() => setFormOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New
                </button>
                </div>
                {/* Floating Add Button */}
                <button 
                    onClick={() => setFormOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl"
                >
                    +
                </button>
            </div>
            )}
            {(formOpen || edit.value) && <FocusAreaForm edit={edit} onSuccess={onSuccess} onClose={onClose}/>}
           {(!formOpen && !edit.value) && <SpecificEventCard
                onDelete={onDelete} 
                setEdit={setEdit} 
                data={focusArea} 
                type="focusArea"
            />}
          
        </>
    );  
}