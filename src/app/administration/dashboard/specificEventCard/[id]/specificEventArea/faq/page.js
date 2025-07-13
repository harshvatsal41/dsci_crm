'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaqApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificFAQCard from '@/Component/SpecificEventDetails/Faq/SpecificFAQCard';
import FaqForm from '@/Component/SpecificEventDetails/Faq/FaqForm';
import { toast } from 'react-toastify';

export default function FAQ() {
    const { Id } = useParams();
    const [faqs, setFaqs] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const onSuccess = () => {
        setFormOpen(false);
        fetchFaqs();
        setEdit({ value: false, data: {} });
    };

    const onClose = () => {
        setFormOpen(false);
        setEdit({ value: false, data: {} });
    };

    const onDelete = () => {
        fetchFaqs();
    };

    const fetchFaqs = async () => {
        dispatch(setLoading(true));
        try {
            const res = await FaqApi(null, "GET", { Id });
            if (res.statusCode === 200) {
                setFaqs(res);
                toast.success(res.message || 'FAQs loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to fetch FAQs');
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, [Id]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <>
            {!isLoading && (
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h1>
                    <button 
                        onClick={() => setFormOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add New FAQ
                    </button>
                    {/* Floating Add Button */}
                    <button 
                        onClick={() => setFormOpen(true)}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl"
                    >
                        +
                    </button>
                </div>
            )}
            {(formOpen || edit.value) && (
                <FaqForm 
                    edit={edit} 
                    onSuccess={onSuccess} 
                    onClose={onClose}
                />
            )}
            {(!formOpen && !edit.value) && <SpecificFAQCard
                onDelete={onDelete}
                setEdit={setEdit}
                data={faqs}
                type="faq"
            />}
        </>
    );
}