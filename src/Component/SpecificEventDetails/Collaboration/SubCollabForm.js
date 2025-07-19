'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { ColabCategoryApi } from '@/utilities/ApiManager';
import { InputField, NativeSelectField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import Modal from '@/Component/UI/Modal';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

const initialState = {
    title: '',
    type: '',
    yeaslyEventId: null,
    createdBy: null
};

const SubCollaborationForm = ({ edit, onSuccess, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [validationErrors, setValidationErrors] = useState({});
    const { Id } = useParams();


    useEffect(() => {
        if (edit?.data?.value) {
            setFormData({
                ...initialState,
                ...edit?.data?.data,
                yeaslyEventId: Id
            });
        } else {
            setFormData({
                ...initialState,
                yeaslyEventId: Id
            });
        }
    }, [edit, Id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.type) errors.type = 'Type is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            dispatch(setLoading(true));
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('type', formData.type);
            submitData.append('eventId', Id); 

            const response = edit?.data?.value 
                ? await ColabCategoryApi(submitData, 'PUT', { Id: edit?.data?.data._id })
                : await ColabCategoryApi(submitData, 'POST', { Id });

            if(response.statusCode === 201 || response.statusCode === 200 || response.status=== "success") {
                toast.success(`Sub Collaboration ${edit?.value ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const typeOptions = [
        { value: '', label: 'Select Type' },
        { value: 'Sponsor', label: 'Sponsor' },
        { value: 'Partner', label: 'Partner' },
    ];

    return (
        <Modal isOpen={true} onClose={onClose} title={edit?.value ? 'Edit Sub Collaboration' : 'New Sub Collaboration'} subtitle="Sub Collaboration Details">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <InputField 
                        label="Title" 
                        required
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        error={validationErrors.title}
                    />
                    
                    {/* <InputField 
                        label="Type *" 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange} 
                        error={validationErrors.type}
                    /> */}

                    <NativeSelectField 
                        label="Type" 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange} 
                        error={validationErrors.type}
                        options={typeOptions}
                        required
                    />
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {edit?.value ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default SubCollaborationForm;