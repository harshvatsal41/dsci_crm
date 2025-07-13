'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {BroadFocusAreaApi} from '@/utilities/ApiManager';
import { useDispatch} from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
export default function FocusArea() {
    const {Id} = useParams();
    console.log(Id)
    const [focusArea, setFocusArea] = useState([]);
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
    console.log(focusArea)
    return (
        <div>
            <DashboardLoading />
            <h1>Focus Area </h1>
        </div>
    );
}
