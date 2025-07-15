'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BlogApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificBlogCard from '@/Component/SpecificEventDetails/Blogs/SpecificBlogCard';
import BlogsForm from '@/Component/SpecificEventDetails/Blogs/BlogsForm';
import { toast } from 'sonner';
import { FiSearch } from 'react-icons/fi';

export default function Testimonial() {
    const { Id } = useParams();
    const [blogs, setBlogs] = useState({ data: [] });
    const [edit, setEdit] = useState({ value: false, data: {} });
    const [formOpen, setFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const onSuccess = () => {
        setFormOpen(false);
        fetchBlogs();
        setEdit({ value: false, data: {} });
    };

    const onClose = () => {
        setFormOpen(false);
        setEdit({ value: false, data: {} });
    };

    const onDelete = () => {
        toast.success('Blog deleted successfully');
        fetchBlogs();
    };

    const fetchBlogs = async () => {
        dispatch(setLoading(true));
        try {
            const res = await BlogApi(null, "GET", { Id });
            if (res.statusCode === 200) {
                setBlogs(res);
                toast.success(res.message || 'Blogs loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to fetch blogs');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [Id]);

    // Filter blogs by name, organization or description
    const filteredBlogs = {
        ...blogs,
        data: blogs.data.filter(blog => {
            const name = blog.title?.toLowerCase() || '';
            const org = blog.body?.toLowerCase() || '';
            const desc = blog.description?.toLowerCase() || '';
            const s = search.toLowerCase();
            return name.includes(s) || org.includes(s) || desc.includes(s);
        })
    };

    console.log(filteredBlogs);

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <>
            {!isLoading && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 w-full">
                    <h1 className="text-2xl font-bold text-gray-800 flex-shrink-0">Blogs</h1>
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 items-stretch sm:items-center sm:justify-end w-full">
                        <div className="relative w-full sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <FiSearch className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white w-full shadow-sm"
                                placeholder="Search by name, org or description..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setFormOpen(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add New Blog
                        </button>
                    </div>
                    {/* Floating Add Button */}
                    <button 
                        onClick={() => setFormOpen(true)}
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl z-50"
                        aria-label="Add New Testimonial"
                    >
                        +
                    </button>
                </div>
            )}
            {(formOpen || edit.value) && (
                <BlogsForm 
                    edit={edit} 
                    onSuccess={onSuccess} 
                    onClose={onClose}
                />
            )}
            {(!formOpen && !edit.value) && <SpecificBlogCard
                onDelete={onDelete}
                setEdit={setEdit}
                data={filteredBlogs}
                type="blog"
            />}"
        </>
    );
}