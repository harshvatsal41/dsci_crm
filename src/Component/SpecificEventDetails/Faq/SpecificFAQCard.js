'use client'
import { useState } from 'react';
import { Button } from '@/Component/UI/TableFormat';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaqApi } from '@/utilities/ApiManager';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { ConfirmDialog } from '@/Component/UI/TableFormat';
import { UserPermissions } from '@/Component/UserPermission';


export default function SpecificFAQCard({ onDelete, setEdit, data }) {
    const dispatch = useDispatch();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState(null);

    UserPermissions();
    const permissions = useSelector((state) => state.menu.permissions);

    const handleDelete = async (id) => {
        if(permissions?.faq?.includes("delete") === false){
            toast.error("You don't have permission to delete this faq");
            return
        }
        setFaqToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if(permissions?.faq?.includes("delete") === false){
            toast.error("You don't have permission to delete this faq");
            return
        }
        if (!faqToDelete) return;
        
        dispatch(setLoading(true));
        try {
            const res = await FaqApi(null, "DELETE", { Id: faqToDelete });
            if (res.statusCode === 200) {
                toast.success('FAQ deleted successfully');
                onDelete();
            }
        } catch (error) {
            toast.error('Failed to delete FAQ');
            console.error(error);
        } finally {
            dispatch(setLoading(false));
            setConfirmOpen(false);
            setFaqToDelete(null);
        }
    };

    return (
        <div className="space-y-4">
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete FAQ"
                description="Are you sure you want to delete this FAQ? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColor="danger"
            />
            
            {data?.data?.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No FAQs found. Add your first FAQ!</p>
                </div>
            ) : (
                data?.data?.map((faq) => (
                    <div key={faq._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if(permissions?.faq?.includes("update") === false){
                                            toast.error("You don't have permission to update this faq");
                                            return
                                        }
                                        setEdit({ value: true, data: faq })}}
                                >
                                    <FiEdit2 className="mr-1" /> Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(faq._id)}
                                >
                                    <FiTrash2 className="mr-1" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}