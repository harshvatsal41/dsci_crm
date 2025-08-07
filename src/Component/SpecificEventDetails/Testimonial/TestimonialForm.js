'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { TestimonialApi } from '@/utilities/ApiManager';
import {toast} from 'sonner';
import { InputField, TextAreaField, NativeSelectField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import Modal from '@/Component/UI/Modal';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FiTrash2 } from 'react-icons/fi';

const initialState = {
    name: '',
    organization: '',
    imageUrlPath: '',
    body: '',
    description: '',
    email: '',
    contentWeight: 0,
    status: 'Active',
    eventId: null
};

const TestimonialForm = ({ edit, onSuccess, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [validationErrors, setValidationErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const { Id } = useParams();

    useEffect(() => {
        if (edit?.value) {
            setFormData({
                ...initialState,
                ...edit.data,
                eventId: Id
            });
            if (edit.data.imageUrlPath) {
                setImagePreview(edit.data.imageUrlPath);
            }
        } else {
            setFormData({
                ...initialState,
                eventId: Id
            });
        }
    }, [edit, Id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate image type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            return toast.error('Only JPG/PNG/WEBP images are allowed');
        }
        
        // Validate image size
        if (file.size > 5 * 1024 * 1024) {
            return toast.error('Max image size is 5MB');
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        if (validationErrors.imageUrlPath) setValidationErrors(prev => ({ ...prev, imageUrlPath: undefined }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.organization.trim()) errors.organization = 'Organization is required';
        if (!formData.body.trim()) errors.body = 'Testimonial content is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Invalid email format';
        if (formData.contentWeight < 0) errors.contentWeight = 'Weight cannot be negative';
        if (!imagePreview && !edit?.value) errors.imageUrlPath = 'Image is required';
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            dispatch(setLoading(true));
            const submitData = new FormData();
            
            // Append all form data
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    submitData.append(key, value);
                }
            });

            // Append image file if new one was selected
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            const response = edit?.value 
                ? await TestimonialApi(submitData, 'PUT', { Id: edit.data._id })
                : await TestimonialApi(submitData, 'POST', { Id });

            if(response.statusCode === 201 || response.statusCode === 200 || response.status === "success") {
                toast.success(`Testimonial ${edit?.value ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (!edit?.value) {
            setFormData(prev => ({ ...prev, imageUrlPath: '' }));
        }
    };

    return (
        <Modal 
            isOpen={true} 
            onClose={onClose} 
            title={edit?.value ? 'Edit Testimonial' : 'New Testimonial'} 
            subtitle="Testimonial Details"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Name " 
                        name="name" 
                        required
                        value={formData.name} 
                        onChange={handleChange} 
                        error={validationErrors.name}
                    />
                    <InputField 
                        label="Organization " 
                        name="organization" 
                        required
                        value={formData.organization} 
                        onChange={handleChange} 
                        error={validationErrors.organization}
                    />
                    <InputField 
                        label="Email " 
                        name="email" 
                        type="email" 
                        required
                        value={formData.email} 
                        onChange={handleChange} 
                        error={validationErrors.email}
                    />
                    <InputField 
                        label="Content Weight " 
                        name="contentWeight" 
                        type="number" 
                        required
                        min="0"
                        value={formData.contentWeight} 
                        onChange={handleChange} 
                        error={validationErrors.contentWeight}
                    />
                    <NativeSelectField
                        label="Status "
                        name="status"
                        required
                        value={formData.status}
                        onChange={handleChange}
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' }
                        ]}
                    />
                </div>

                <TextAreaField 
                    label="Description " 
                    name="description" 
                    required
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={3}
                    error={validationErrors.description}
                />

                <TextAreaField 
                    label="Testimonial Content " 
                    name="body" 
                    required
                    value={formData.body} 
                    onChange={handleChange} 
                    rows={5}
                    error={validationErrors.body}
                />

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Profile Image *</label>
                    <div className="flex items-center gap-4">
                        {imagePreview ? (
                            <div className="relative">
                                <Image 
                                    src={imagePreview} 
                                    alt="Testimonial" 
                                    width={120} 
                                    height={120} 
                                    className="rounded object-cover border"
                                />
                                <button 
                                    type="button" 
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:border-blue-500 transition-colors">
                                    <p className="text-sm">Click to upload image</p>
                                    <p className="text-xs text-gray-500">JPG/PNG/WEBP (max 5MB)</p>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                    />
                                </div>
                            </label>
                        )}
                    </div>
                    {validationErrors.imageUrlPath && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.imageUrlPath}</p>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {edit?.value ? 'Update Testimonial' : 'Create Testimonial'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default TestimonialForm;