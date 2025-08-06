'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import { InputField, TextAreaField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import { FiEdit2, FiUpload, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { BlogApi } from '@/utilities/ApiManager';
import {toast} from 'sonner';

const initialState = {
    title: '',
    body: '',
    content: '',
    externalLink: '',
    imageUrlPath: '',
    contentWeight: 0,
    eventId: null
};

const BlogsForm = ({ edit, onSuccess, onClose }) => {
    const dispatch = useDispatch();
    const { Id } = useParams();
    const [formData, setFormData] = useState(initialState);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);

    const loadBlogData = useCallback(async (data) => {
        try {
            dispatch(setLoading(true));
            setFormData({
                title: data?.title || '',
                body: data?.body || '',
                content: data?.content || '',
                externalLink: data?.externalLink || '',
                imageUrlPath: data?.image || '',
                contentWeight: data?.contentWeight || 0,
                eventId: Id
            });
            if (data?.image) {
                setPreviewImage(`${data.image}?${new Date().getTime()}`);
            }
            setIsNewImageUploaded(false);
        } catch (error) {
            toast.error('Failed to load blog data');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, Id]);

    useEffect(() => {
        if (edit?.value) {
            loadBlogData(edit.data);
        } else {
            setFormData({
                ...initialState,
                eventId: Id
            });
        }
    }, [edit, Id, loadBlogData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, and WEBP images are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setIsNewImageUploaded(true);
        if (validationErrors.image) {
            setValidationErrors(prev => ({ ...prev, image: undefined }));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewImage('');
        setIsNewImageUploaded(true);
        if (!edit?.value) {
            setFormData(prev => ({ ...prev, imageUrlPath: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.body.trim()) errors.body = 'Body content is required';
        if (!formData.content.trim()) errors.content = 'Content is required';
        if (!formData.externalLink.trim()) errors.externalLink = 'External link is required';
        if (formData.contentWeight < 0) errors.contentWeight = 'Weight cannot be negative';
        if (!previewImage && !edit?.value) errors.image = 'Image is required';

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
            submitData.append('body', formData.body);
            submitData.append('content', formData.content);
            submitData.append('externalLink', formData.externalLink);
            submitData.append('contentWeight', formData.contentWeight);
            submitData.append('eventId', Id);

            // Only append image if it's a new upload
            if (isNewImageUploaded && imageFile) {
                submitData.append('image', imageFile);
            } else if (isNewImageUploaded && !imageFile) {
                // Handle case where image was removed
                submitData.append('removeImage', 'true');
            }


            let response;
            if (edit?.value) {
                response = await BlogApi(submitData, 'PUT', { Id: edit?.data?._id });
            } else {
                response = await BlogApi(submitData, 'POST', { Id });
            }

            if (response.statusCode === 200 || response.statusCode === 201 || response.status === "success") {
                toast.success(response.message || `Blog ${edit?.value ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`${edit?.value ? 'Edit' : 'Create New'} Blog Post`} size="xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <InputField
                            label="Title *"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            error={validationErrors.title}
                        />

                        <InputField
                            label="External Link *"
                            name="externalLink"
                            value={formData.externalLink}
                            onChange={handleChange}
                            icon={<FiExternalLink className="text-gray-400" />}
                            error={validationErrors.externalLink}
                        />

                        <InputField
                            label="Content Weight *"
                            name="contentWeight"
                            type="number"
                            min="0"
                            value={formData.contentWeight}
                            onChange={handleChange}
                            error={validationErrors.contentWeight}
                        />

                        <TextAreaField
                            label="Body Content *"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            rows={6}
                            error={validationErrors.body}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image *
                            </label>

                            {previewImage ? (
                                <div className="relative group">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                        <Image
                                            src={previewImage}
                                            alt="Blog preview"
                                            width={600}
                                            height={400}
                                            className="w-full h-64 object-cover"
                                            unoptimized={isNewImageUploaded} // Disable optimization for new uploads
                                            onError={(e) => {
                                                // Fallback to original image if new one fails to load
                                                if (edit?.value && formData.imageUrlPath) {
                                                    setPreviewImage(`${formData.imageUrlPath}?${new Date().getTime()}`);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                <span>Upload an image</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, WEBP up to 5MB
                                        </p>
                                    </div>
                                </div>
                            )}
                            {validationErrors.image && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
                            )}
                        </div>

                        <TextAreaField
                            label="Content *"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={8}
                            error={validationErrors.content}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button type="submit">
                        {edit?.value ? (
                            <>
                                <FiEdit2 className="mr-2" /> Update Blog
                            </>
                        ) : (
                            <>
                                <FiUpload className="mr-2" /> Create Blog
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default BlogsForm;