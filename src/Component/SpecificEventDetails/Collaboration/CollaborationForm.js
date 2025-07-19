'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import { InputField, TextAreaField, NativeSelectField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import { FiEdit2, FiUpload, FiTrash2, FiExternalLink, FiPlus, FiMinus } from 'react-icons/fi';
import { CollaborationApi, ColabCategoryApi } from '@/utilities/ApiManager';
import { toast } from 'sonner';

const initialState = {
    title: '',
    body: '',
    about: '',
    websiteLink: '',
    logoUrlPath: '',
    description: '',
    contentWeight: 0,
    subCategory: '',
    socialMediaLinks: [],
    yeaslyEventId: null
};

const socialMediaInitialState = {
    title: '',
    link: ''
};

const CollaborationForm = ({ edit, onSuccess, onClose }) => {
    const dispatch = useDispatch();
    const { Id } = useParams();
    const [formData, setFormData] = useState(initialState);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);
    const [newSocialLink, setNewSocialLink] = useState(socialMediaInitialState);
    const [subCategories, setSubCategories] = useState([]);
    const [loadingSubCategories, setLoadingSubCategories] = useState(false);

    useEffect(() => {
        const loadSubCategories = async () => {
            try {
                setLoadingSubCategories(true);
                const response = await ColabCategoryApi(null, "GET", { Id });
                if (response.statusCode === 200 || response.status=== "success") {
                    setSubCategories(response.data);
                }
            } catch (error) {
                toast.error('Failed to load subcategories');
            } finally {
                setLoadingSubCategories(false);
            }
        };

        loadSubCategories();

        if (edit?.value) {
            console.log(
                "data",edit.data.data)
            loadCollaborationData(edit?.data?.data);
        } else {
            setFormData({
                ...initialState,
                yeaslyEventId: Id
            });
        }
    }, [edit, Id]);

    const loadCollaborationData = async (data) => {
        try {
            dispatch(setLoading(true));
            setFormData({
                title: data?.title || '',
                body: data?.body || '',
                about: data?.about || '',
                websiteLink: data?.websiteLink || '',
                logoUrlPath: data?.logoUrlPath || '',
                description: data?.description || '',
                contentWeight: data?.contentWeight || 0,
                subCategory: data?.subCategory?._id || data?.subCategory || '',
                socialMediaLinks: data?.socialMediaLinks || [],
                yeaslyEventId: Id
            });
            if (data?.logoUrlPath) {
                setPreviewImage(`${data.logoUrlPath}?${new Date().getTime()}`);
            }
            setIsNewImageUploaded(false);
        } catch (error) {
            toast.error('Failed to load collaboration data');
        } finally {
            dispatch(setLoading(false));
        }
    };

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

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setNewSocialLink(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSocialLink = () => {
        if (!newSocialLink.title || !newSocialLink.link) {
            toast.error('Both title and link are required');
            return;
        }
        setFormData(prev => ({
            ...prev,
            socialMediaLinks: [...prev.socialMediaLinks, newSocialLink]
        }));
        setNewSocialLink(socialMediaInitialState);
    };

    const removeSocialLink = (index) => {
        setFormData(prev => ({
            ...prev,
            socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, and WEBP images are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setIsNewImageUploaded(true);
        if (validationErrors.logoUrlPath) {
            setValidationErrors(prev => ({ ...prev, logoUrlPath: undefined }));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewImage('');
        setIsNewImageUploaded(true);
        if (!edit?.value) {
            setFormData(prev => ({ ...prev, logoUrlPath: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.body.trim()) errors.body = 'Body content is required';
        if (!formData.about.trim()) errors.about = 'About section is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.subCategory) errors.subCategory = 'Subcategory is required';
        if (formData.contentWeight < 0) errors.contentWeight = 'Weight cannot be negative';
        if (!previewImage && !edit?.value) errors.logoUrlPath = 'Logo is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!validateForm()) return;

        try {
            dispatch(setLoading(true));

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('body', formData.body);
            submitData.append('about', formData.about);
            submitData.append('websiteLink', formData.websiteLink);
            submitData.append('description', formData.description);
            submitData.append('contentWeight', formData.contentWeight);
            submitData.append('subCategory', formData.subCategory);
            submitData.append('yeaslyEventId', Id);
            submitData.append('socialMediaLinks', JSON.stringify(formData.socialMediaLinks));

            if (isNewImageUploaded && imageFile) {
                submitData.append('image', imageFile);
            } else if (isNewImageUploaded && !imageFile) {
                submitData.append('removeLogo', 'true');
            }

            let response;
            if (edit?.value) {
                response = await CollaborationApi(submitData, 'PUT', { Id: edit?.data?._id });
            } else {
                response = await CollaborationApi(submitData, 'POST', {Id: Id });
            }

            if (response.statusCode === 200 || response.statusCode === 201 || response.status === "success") {
                alert("Succefuly reponse")
                toast.success(response.message || `Collaboration ${edit?.value ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`${edit?.value ? 'Edit' : 'Create New'} Collaboration`} size="2xl">
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
                            label="Website Link"
                            name="websiteLink"
                            value={formData.websiteLink}
                            onChange={handleChange}
                            icon={<FiExternalLink className="text-gray-400" />}
                        />

                        <NativeSelectField
                            id="subCategory"
                            name="subCategory"
                            label="Subcategory"
                            value={formData.subCategory}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Select a subcategory" },
                                ...subCategories.map(cat => ({
                                    value: cat._id,
                                    label: `${cat.title} (${cat.type})`
                                }))
                            ]}
                            required={true}
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
                            label="About *"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows={3}
                            error={validationErrors.about}
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo *
                            </label>

                            {previewImage ? (
                                <div className="relative group">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                        <Image
                                            src={previewImage}
                                            alt="Logo preview"
                                            width={600}
                                            height={400}
                                            className="w-full h-48 object-contain bg-gray-100"
                                            unoptimized={isNewImageUploaded}
                                            onError={(e) => {
                                                if (edit?.value && formData.logoUrlPath) {
                                                    setPreviewImage(`${formData.logoUrlPath}?${new Date().getTime()}`);
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
                                                <span>Upload a logo</span>
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
                            {validationErrors.logoUrlPath && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.logoUrlPath}</p>
                            )}
                        </div>

                        <TextAreaField
                            label="Description *"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            error={validationErrors.description}
                        />

                        <TextAreaField
                            label="Body Content *"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            rows={4}
                            error={validationErrors.body}
                        />
                    </div>
                </div>

                {/* Social Media Links Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Platform (e.g., Facebook)"
                            name="title"
                            value={newSocialLink.title}
                            onChange={handleSocialLinkChange}
                        />
                        <InputField
                            label="Link URL"
                            name="link"
                            value={newSocialLink.link}
                            onChange={handleSocialLinkChange}
                            icon={<FiExternalLink className="text-gray-400" />}
                        />
                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addSocialLink}
                                className="flex items-center justify-center"
                            >
                                <FiPlus className="mr-2" /> Add Link
                            </Button>
                        </div>
                    </div>

                    {formData.socialMediaLinks.length > 0 && (
                        <div className="space-y-2">
                            {formData.socialMediaLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <div className="flex-1">
                                        <p className="font-medium">{link.title}</p>
                                        <p className="text-sm text-gray-600 truncate">{link.link}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSocialLink(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiMinus />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
                                <FiEdit2 className="mr-2" /> Update Collaboration
                            </>
                        ) : (
                            <>
                                <FiUpload className="mr-2" /> Create Collaboration
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CollaborationForm;