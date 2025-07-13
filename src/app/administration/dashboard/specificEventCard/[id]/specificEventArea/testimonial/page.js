'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TestimonialApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import TestimonialForm from '@/Component/SpecificEventDetails/Testimonial/TestimonialForm';
import SpecificTestimonialCard from '@/Component/SpecificEventDetails/Testimonial/SpecificTestimonialCard';
import { toast } from 'react-toastify';
import { Button } from '@/Component/UI/TableFormat';

export default function TestimonialPage() {
    const { Id } = useParams();
    const [testimonials, setTestimonials] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const onSuccess = () => {
        setFormOpen(false);
        fetchTestimonials();
        setEdit({ value: false, data: {} });
    };

    const onClose = () => {
        setFormOpen(false);
        setEdit({ value: false, data: {} });
    };

    const onDelete = () => {
        fetchTestimonials();
    };

    const fetchTestimonials = async () => {
        dispatch(setLoading(true));
        try {
            const res = await TestimonialApi(null, "GET", { Id });
            if (res.statusCode === 200) {
                setTestimonials(res);
                toast.success(res.message || 'Testimonials loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to fetch testimonials');
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, [Id]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <>
            {!isLoading && (
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
                    <Button 
                        onClick={() => setFormOpen(true)}
                        variant="primary"
                    >
                        Add New Testimonial
                    </Button>
                    {/* Floating Add Button */}
                    <button 
                        onClick={() => setFormOpen(true)}
                        className="fixed bottom-8 z-10 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl"
                    >
                        +
                    </button>
                </div>
            )}
            {(formOpen || edit.value) && (
                <TestimonialForm 
                    edit={edit} 
                    onSuccess={onSuccess} 
                    onClose={onClose}
                />
            )}
            <SpecificTestimonialCard
                onDelete={onDelete}
                setEdit={setEdit}
                data={testimonials}
                type="testimonial"
            />
        </>
    );
}