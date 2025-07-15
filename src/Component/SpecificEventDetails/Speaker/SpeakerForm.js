'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { SpeakerApi } from '@/utilities/ApiManager';
import { InputField, NativeSelectField, TextAreaField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import Image from 'next/image';
import { FiPlus, FiTrash2, FiEdit2, FiMinus } from 'react-icons/fi';
import Modal from '@/Component/UI/Modal';
import { useParams } from 'next/navigation';
import {toast} from 'sonner';

const initialState = {
    name: '', position: '', organization: '', title: '', bio: '',
    phone: '', emailOfficial: '', emailPersonal: '', photoUrl: '',
    expertise: [], awards: [], experience: 0,
    socialLinks: { website: '', linkedin: '', twitter: '', facebook: '' },
    dob: '', gender: '', internalNote: '', yeaslyEventId: null
};

const SpeakerForm = ({ edit, onSuccess, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [newExpertise, setNewExpertise] = useState('');
    const [newAward, setNewAward] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const { Id } = useParams();

    useEffect(() => {
        if (edit?.value) {
            const { dob, ...data } = edit.data;
            console.log("Edit Data", edit.data)
            setFormData({
                ...initialState,
                ...data,
                socialLinks: {
                    ...initialState.socialLinks,
                    ...(data.socialLinks || {})
                },
                dob: dob ? new Date(dob).toISOString().split('T')[0] : '',
                yeaslyEventId: Id
            });
        }
    }, [edit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            return toast.error('Only JPG/PNG/WEBP allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            return toast.error('Max size 5MB');
        }

        setImageFile(file);
        if (validationErrors.photoUrl) setValidationErrors(prev => ({ ...prev, photoUrl: undefined }));
    };

    const handleArrayChange = (type, value, action) => {
        if (action === 'add' && value.trim()) {
            setFormData(prev => ({
                ...prev,
                [type]: [...prev[type], value.trim()]
            }));
            type === 'expertise' ? setNewExpertise('') : setNewAward('');
        } else if (action === 'remove') {
            setFormData(prev => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== value)
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        ['name', 'position', 'bio', 'phone', 'emailOfficial'].forEach(field => {
            if (!formData[field].trim()) errors[field] = 'Required field';
        });
        if (formData.expertise.length === 0) errors.expertise = 'Add at least one expertise';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            dispatch(setLoading(true));
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val !== null && val !== undefined && val !== '') {
                    submitData.append(key, typeof val === 'object' ? JSON.stringify(val) : val);
                }
            });
            submitData.append('yeaslyEventId', Id);
            if (imageFile) submitData.append('photo', imageFile);

            const response = edit?.value 
                ? await SpeakerApi(submitData, 'POST', { Id: edit.data._id })
                : await SpeakerApi(submitData, 'POST');
             if(response.statusCode === 201){
                toast.success(`Speaker ${edit?.value ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={edit?.value ? 'Edit Speaker' : 'New Speaker'} subtitle="Speaker Details">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                    {/* Basic Info */}
                    <InputField label="Full Name *" name="name" value={formData?.name || ''} onChange={handleChange} error={validationErrors.name} />
                    <InputField label="Position *" name="position" value={formData?.position || ''} onChange={handleChange} error={validationErrors.position} />
                    <InputField label="Organization" name="organization" value={formData?.organization || ''} onChange={handleChange} />
                    <InputField label="Title" name="title" value={formData?.title || ''} onChange={handleChange} />
                    
                    {/* Contact Info */}
                    <InputField label="Phone *" name="phone" value={formData?.phone || ''} onChange={handleChange} error={validationErrors.phone} />
                    <InputField label="Official Email *" type="email" name="emailOfficial" value={formData?.emailOfficial || ''} onChange={handleChange} error={validationErrors.emailOfficial} />
                    <InputField label="Personal Email" type="email" name="emailPersonal" value={formData?.emailPersonal || ''} onChange={handleChange} />
                    
                    {/* Social Links */}
                    <InputField label="LinkedIn" name="linkedin" value={formData?.socialLinks?.linkedin || ''} onChange={handleSocialLinkChange} placeholder="https://linkedin.com/in/username" />
                    <InputField label="Twitter" name="twitter" value={formData?.socialLinks?.twitter || ''} onChange={handleSocialLinkChange} placeholder="https://twitter.com/username" />
                    
                    {/* Personal Details */}
                    <InputField label="Date of Birth" type="date" name="dob" value={formData?.dob || ''} onChange={handleChange} />
                    <NativeSelectField 
                        label="Gender" 
                        name="gender" 
                        value={formData?.gender || ''} 
                        onChange={handleChange}
                        options={['', 'Male', 'Female', 'Other'].map(g => ({ value: g, label: g || 'Select Gender' }))}
                    />
                </div>

                {/* Bio */}
                <TextAreaField label="Bio *" name="bio" value={formData?.bio || ''} onChange={handleChange} rows={3} error={validationErrors.bio} />

                {/* Expertise */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <InputField 
                            label="Expertise" 
                            value={newExpertise} 
                            onChange={(e) => setNewExpertise(e.target.value)} 
                            className="flex-1" 
                        />
                        <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            className="mt-7"
                            onClick={() => handleArrayChange('expertise', newExpertise, 'add')}
                        >
                            <FiPlus />
                        </Button>
                    </div>
                    {validationErrors.expertise && <p className="text-red-500 text-sm">{validationErrors.expertise}</p>}
                    <div className="flex flex-wrap gap-2">
                        {formData.expertise.map((item, i) => (
                            <span key={i} className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                                {item}
                                <button type="button" onClick={() => handleArrayChange('expertise', i, 'remove')} className="ml-1 text-gray-500 hover:text-red-500">
                                    <FiMinus size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Profile Photo</label>
                    <div className="flex items-center gap-4">
                        {formData?.photoUrl || imageFile ? (
                            <div className="relative">
                                <Image 
                                    src={imageFile ? URL.createObjectURL(imageFile) : formData?.photoUrl} 
                                    alt="Speaker" 
                                    width={80} 
                                    height={80} 
                                    className="rounded object-cover"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => { setImageFile(null); if (!edit?.value) setFormData(p => ({ ...p, photoUrl: '' })) }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded p-2 text-center">
                                    <p className="text-sm">Click to upload</p>
                                    <p className="text-xs text-gray-500">PNG/JPG/WEBP (max 5MB)</p>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </div>
                            </label>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end pt-4 border-t">
                    {/* <div>
                        {edit?.value && (
                            <Button 
                                type="button" 
                                variant="danger" 
                                onClick={() => confirm('Delete speaker?') && handleDelete()}
                            >
                                <FiTrash2 className="mr-1" /> Delete
                            </Button>
                        )}
                    </div> */}
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">
                            {edit?.value ? <><FiEdit2 className="mr-1" /> Update</> : <><FiPlus className="mr-1" /> Create</>}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default SpeakerForm;