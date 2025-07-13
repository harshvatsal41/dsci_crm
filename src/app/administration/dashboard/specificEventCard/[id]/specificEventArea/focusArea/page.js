'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {BroadFocusAreaApi} from '@/utilities/ApiManager';
import { useDispatch} from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificEventCard from '@/Component/SpecificEventDetails/SpecificEventCard';
export default function FocusArea() {
    const {Id} = useParams();
    const [focusArea, setFocusArea] = useState([]);
    const [edit, setEdit]= useState({value:false, data:{}});
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(setLoading(true));
        const fetchFocusArea = async () => {
            const res = await BroadFocusAreaApi(null, "GET", {Id});
            setFocusArea(res);
        };
        fetchFocusArea();
        dispatch(setLoading(false));
    }, [Id]);
    return (
        <div>
            <DashboardLoading />
            <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold text-gray-800">Focus Area</h1>
          {/* <button 
            onClick={() => setEdit({value:true, data:{}})}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New
          </button> */}
            {/* Floating Add Button */}
         
            <button 
              onClick={() => setEdit(true)}
              className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl"
            >
              +
            </button>
      </div>
            
            <SpecificEventCard setEdit={setEdit} data={focusArea} type="focusArea"/>
        </div>
    );
}
