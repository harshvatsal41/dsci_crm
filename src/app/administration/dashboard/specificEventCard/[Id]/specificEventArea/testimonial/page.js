'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect,useCallback } from 'react';
import { TestimonialApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import TestimonialForm from '@/Component/SpecificEventDetails/Testimonial/TestimonialForm';
import SpecificTestimonialCard from '@/Component/SpecificEventDetails/Testimonial/SpecificTestimonialCard';
import { toast } from 'sonner';
import { Button } from '@/Component/UI/TableFormat';
import { FiSearch } from 'react-icons/fi';
import { UserPermissions } from '@/Component/UserPermission';


export default function TestimonialPage() {
    const { Id } = useParams();
    const [testimonials, setTestimonials] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);
    UserPermissions();
    const permissions = useSelector((state) => state.menu.permissions);
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

    const fetchTestimonials = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const res = await TestimonialApi(null, "GET", { Id });
            if (res.statusCode === 200) {
                setTestimonials(res);
                toast.success(res.message || 'Testimonials loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to fetch testimonials');
        } finally {
            dispatch(setLoading(false));
        }
    },[dispatch, Id]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    // Filter testimonials by title
    const filteredTestimonials = {
        ...testimonials,
        data: testimonials.data.filter(t => (t.name || '').toLowerCase().includes(search.toLowerCase()))
    };

    if(permissions?.testimonial.includes('read') === false){
        toast.error('You are not authorized to view testimonials');
        return 
    }

    return (
        <>
            {!isLoading && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 w-full">
                    <h1 className="text-2xl font-bold text-gray-800 flex-shrink-0">Testimonials</h1>
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 items-stretch sm:items-center sm:justify-end w-full">
                        <div className="relative w-full sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FiSearch className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white w-full shadow-sm"
                                placeholder="Search by title..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={() => { 
                                if(permissions?.testimonial.includes('create')===true){
                                    setFormOpen(true)
                                }else{
                                    toast.error('You are not authorized to add testimonial')
                                }
                            }}
                            variant="primary"
                            className="w-full sm:w-auto"
                        >
                            Add New Testimonial
                        </Button>
                    </div>
                    {/* Floating Add Button */}
                    <button 
                        onClick={() => {
                            if(permissions?.testimonial.includes('create')===true){
                                setFormOpen(true)
                            }else{
                                toast.error('You are not authorized to add testimonial')
                            }
                        }}
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl z-50"
                        aria-label="Add New Testimonial"
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
                data={filteredTestimonials}
                type="testimonial"
            />
        </>
    );
}