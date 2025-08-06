'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Modal from '@/Component/UI/Modal';
import { InputField, NativeSelectField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import { FiEdit2, FiUpload, FiTrash2, FiDollarSign, FiPercent, FiPlus } from 'react-icons/fi';
import { TicketApi } from '@/utilities/ApiManager';

const initialState = {
    name: '',
    subHeading: '',
    paymentUrl: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    availableStatus: 'active',
    accessIncludes: [],
    validityPeriod: {
        startDate: '',
        endDate: ''
    },
    applicableDate: '',
    passType: '',
    venue: '',
    yeaslyEventId: null
};

const TicketForm = ({ edit, onSuccess, onClose, eventId }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [validationErrors, setValidationErrors] = useState({});
    const [newAccessInclude, setNewAccessInclude] = useState({
        label: '',
        isComplimentary: false
    });
    const [priceReferences, setPriceReferences] = useState([{
        price: '',
        eligibility: ''
    }]);

    const loadTicketData = useCallback(async (data) => {
        try {
            dispatch(setLoading(true));
            setFormData({
                name: data?.name || '',
                subHeading: data?.subHeading || '',
                paymentUrl: data?.paymentUrl || '',
                price: data?.price || '',
                originalPrice: data?.originalPrice || data?.price || '',
                discountPercentage: data?.discountPercentage || '',
                availableStatus: data?.availableStatus || 'active',
                accessIncludes: data?.accessIncludes || [],
                validityPeriod: {
                    startDate: data?.validityPeriod?.startDate ? new Date(data.validityPeriod.startDate).toISOString().split('T')[0] : '',
                    endDate: data?.validityPeriod?.endDate ? new Date(data.validityPeriod.endDate).toISOString().split('T')[0] : ''
                },
                applicableDate: data?.applicableDate ? new Date(data.applicableDate).toISOString().split('T')[0] : '',
                passType: data?.passType || '',
                venue: data?.venue || '',
            });
            
            if (data?.priceReference) {
                setPriceReferences(data.priceReference.map(ref => ({
                    price: ref.price || '',
                    eligibility: ref.eligibility || ''
                })));
            }
        } catch (error) {
            toast.error('Failed to load ticket data');
        } finally {
            dispatch(setLoading(false));
        }
    },[dispatch]);


    useEffect(() => {
        if (edit?.value) {
            loadTicketData(edit.data);
        } else {
            setFormData(initialState);
        }
    }, [edit, loadTicketData]);

    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('validityPeriod.')) {
            const periodField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                validityPeriod: {
                    ...prev.validityPeriod,
                    [periodField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Handle price/discount calculations
        if (name === 'price' || name === 'originalPrice' || name === 'discountPercentage') {
            handlePriceChange(name, type === 'number' ? parseFloat(value) : value);
        }

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handlePriceReferenceChange = (index, field, value) => {
        const updatedReferences = [...priceReferences];
        updatedReferences[index][field] = value;
        setPriceReferences(updatedReferences);
    };

    const addPriceReference = () => {
        setPriceReferences([...priceReferences, { price: '', eligibility: '' }]);
    };

    const removePriceReference = (index) => {
        if (priceReferences.length > 1) {
            const updatedReferences = priceReferences.filter((_, i) => i !== index);
            setPriceReferences(updatedReferences);
        }
    };

    const handlePriceChange = (field, value) => {
        // If originalPrice changes, recalculate discount
        if (field === 'originalPrice') {
            const newOriginalPrice = parseFloat(value) || 0;
            const currentPrice = parseFloat(formData.price) || 0;
            const discount = newOriginalPrice > 0 ? 
                Math.round(((newOriginalPrice - currentPrice) / newOriginalPrice) * 100) : 0;
            
            setFormData(prev => ({
                ...prev,
                originalPrice: newOriginalPrice,
                discountPercentage: discount
            }));
        } 
        // If price changes, recalculate discount
        else if (field === 'price') {
            const newPrice = parseFloat(value) || 0;
            const originalPrice = parseFloat(formData.originalPrice) || 0;
            const discount = originalPrice > 0 ? 
                Math.round(((originalPrice - newPrice) / originalPrice) * 100) : 0;
            
            setFormData(prev => ({
                ...prev,
                price: newPrice,
                discountPercentage: discount
            }));
        } 
        // If discount changes, recalculate price
        else if (field === 'discountPercentage') {
            const newDiscount = parseFloat(value) || 0;
            const originalPrice = parseFloat(formData.originalPrice) || 0;
            const price = originalPrice - (originalPrice * newDiscount / 100);
            
            setFormData(prev => ({
                ...prev,
                price: Math.round(price * 100) / 100, // Round to 2 decimal places
                discountPercentage: newDiscount
            }));
        }
    };

    const handleAccessIncludeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAccessInclude(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addAccessInclude = () => {
        if (!newAccessInclude.label.trim()) {
            toast.error('Access include label is required');
            return;
        }

        setFormData(prev => ({
            ...prev,
            accessIncludes: [...prev.accessIncludes, newAccessInclude]
        }));

        setNewAccessInclude({
            label: '',
            isComplimentary: false
        });
    };

    const removeAccessInclude = (index) => {
        setFormData(prev => ({
            ...prev,
            accessIncludes: prev.accessIncludes.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) toast.error ('Name is required');
        if (!formData.paymentUrl.trim()) toast.error ('Payment URL is required');
        if (formData.price < 0) toast.error ('Price cannot be negative');
        if (formData.originalPrice < 0) toast.error ('Original price cannot be negative');
        if (formData.discountPercentage < 0) toast.error ('Discount cannot be negative');
        if (formData.discountPercentage > 100) toast.error ('Discount cannot exceed 100%');
        if (!formData.passType.trim()) toast.error ('Pass type is required');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
 
        try {
            dispatch(setLoading(true));
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('subHeading', formData.subHeading);
            formDataToSend.append('paymentUrl', formData.paymentUrl);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('originalPrice', formData.originalPrice);
            formDataToSend.append('discountPercentage', formData.discountPercentage);
            formDataToSend.append('availableStatus', formData.availableStatus);
            formDataToSend.append('passType', formData.passType);
            formDataToSend.append('venue', formData.venue);
            formDataToSend.append('applicableDate', formData.applicableDate);
            
            formDataToSend.append('accessIncludes', JSON.stringify(formData.accessIncludes));
            formDataToSend.append('validityPeriod', JSON.stringify({
                startDate: formData.validityPeriod.startDate,
                endDate: formData.validityPeriod.endDate
            }));
            formDataToSend.append('priceReference', JSON.stringify(
                priceReferences.filter(ref => ref.price && ref.eligibility)
            ));

            let response;
            if (edit?.value) {
                response = await TicketApi(formDataToSend, 'PUT', { Id: edit?.data?._id });
            } else {
                response = await TicketApi(formDataToSend, 'POST', {Id: eventId});
            }

            if (response.statusCode === 200 || response.statusCode === 201 || response.status === "success") {
                onSuccess(response.data);
                toast.success(response.message || `Ticket ${edit?.value ? 'updated' : 'created'} successfully`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`${edit?.value ? 'Edit' : 'Create New'} Ticket`} size="xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <InputField
                            label="Ticket Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={validationErrors.name}
                        />

                        <InputField
                            label="Subheading"
                            name="subHeading"
                            value={formData.subHeading}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Payment URL *"
                            name="paymentUrl"
                            value={formData.paymentUrl}
                            onChange={handleChange}
                            error={validationErrors.paymentUrl}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label="Original Price *"
                                name="originalPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                icon={<FiDollarSign className="text-gray-400" />}
                                error={validationErrors.originalPrice}
                            />

                            <InputField
                                label="Discount %"
                                name="discountPercentage"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discountPercentage}
                                onChange={handleChange}
                                icon={<FiPercent className="text-gray-400" />}
                                error={validationErrors.discountPercentage}
                            />

                            <InputField
                                label="Final Price *"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                icon={<FiDollarSign className="text-gray-400" />}
                                error={validationErrors.price}
                                disabled
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Price References
                            </label>
                            {priceReferences.map((ref, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="Price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={ref.price}
                                        onChange={(e) => handlePriceReferenceChange(index, 'price', e.target.value)}
                                        noMargin
                                    />
                                    <div className="flex items-end">
                                        <InputField
                                            label="Eligibility"
                                            value={ref.eligibility}
                                            onChange={(e) => handlePriceReferenceChange(index, 'eligibility', e.target.value)}
                                            noMargin
                                        />
                                        {priceReferences.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePriceReference(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPriceReference}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                <FiPlus className="mr-1" /> Add Price Reference
                            </button>
                        </div>

                        <NativeSelectField
                            label="Status *"
                            name="availableStatus"
                            value={formData.availableStatus}
                            onChange={handleChange}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'soldOut', label: 'Sold Out' }
                            ]}
                        />
                    </div>

                    <div className="space-y-6">
                        {/* <NativeSelectField
                            label="Pass Type *"
                            name="passType"
                            value={formData.passType}
                            onChange={handleChange}
                            options={[
                                { value: 'general', label: 'General Admission' },
                                { value: 'vip', label: 'VIP' },
                                { value: 'premium', label: 'Premium' },
                                { value: 'student', label: 'Student' },
                                { value: 'early-bird', label: 'Early Bird' }
                            ]}
                            error={validationErrors.passType}
                        /> */}
                        <InputField
                            label="Pass Type *"
                            name="passType"
                            value={formData.passType}
                            onChange={handleChange}
                            error={validationErrors.passType}
                        />

                        <InputField
                            label="Venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label="Valid From"
                                name="validityPeriod.startDate"
                                type="date"
                                value={formData.validityPeriod.startDate}
                                onChange={handleChange}
                            />

                            <InputField
                                label="Valid Until"
                                name="validityPeriod.endDate"
                                type="date"
                                value={formData.validityPeriod.endDate}
                                onChange={handleChange}
                            />
                        </div>

                        <InputField
                            label="Applicable Date"
                            name="applicableDate"
                            type="date"
                            value={formData.applicableDate}
                            onChange={handleChange}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Access Includes
                            </label>
                            {formData?.accessIncludes?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span>
                                        {item.label} 
                                        {item.isComplimentary && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Complimentary</span>
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeAccessInclude(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <div className="flex items-end grid grid-cols-3 gap-2">
                                <InputField
                                    label="New Access Include"
                                    name="label"
                                    value={newAccessInclude.label}
                                    onChange={handleAccessIncludeChange}
                                    noMargin
                                />
                                <div className="flex items-center">
                                    <input
                                        id="isComplimentaryInclude"
                                        name="isComplimentary"
                                        type="checkbox"
                                        checked={newAccessInclude.isComplimentary}
                                        onChange={handleAccessIncludeChange}
                                        className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isComplimentaryInclude" className="ml-2 block text-sm text-gray-700">
                                        Complimentary
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={addAccessInclude}
                                    className="ml-6 bg-blue-600 text-white rounded-lg flex justify-center hover:bg-blue-700"
                                >
                                    <FiPlus className="w-6 h-6" /> 
                                </button>
                            </div>
                        </div>
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
                                <FiEdit2 className="mr-2" /> Update Ticket
                            </>
                        ) : (
                            <>
                                <FiUpload className="mr-2" /> Create Ticket
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TicketForm;