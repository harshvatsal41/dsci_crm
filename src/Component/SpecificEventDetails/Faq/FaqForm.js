'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { FaqApi } from '@/utilities/ApiManager';
import { toast } from 'react-toastify';
import { InputField, TextAreaField } from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import Modal from '@/Component/UI/Modal';
import { useParams } from 'next/navigation';

const initialState = {
    question: '',
    answer: '',
    eventId: null
};

const FaqForm = ({ edit, onSuccess, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const [validationErrors, setValidationErrors] = useState({});
    const { Id } = useParams();

    useEffect(() => {
        if (edit?.value) {
            setFormData({
                ...initialState,
                ...edit.data,
                eventId: Id
            });
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

    const validateForm = () => {
        const errors = {};
        if (!formData.question.trim()) errors.question = 'Question is required';
        if (!formData.answer.trim()) errors.answer = 'Answer is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            dispatch(setLoading(true));
            const submitData = new FormData();
            submitData.append('question', formData.question);
            submitData.append('answer', formData.answer);
            // submitData.append('eventId', Id);

            const response = edit?.value 
                ? await FaqApi(submitData, 'PUT', { Id: edit.data._id })
                : await FaqApi(submitData, 'POST', { Id });

            if(response.statusCode === 201 || response.statusCode === 200) {
                toast.success(`FAQ ${edit?.value ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            dispatch(setLoading(false));
        }
    };


    return (
        <Modal isOpen={true} onClose={onClose} title={edit?.value ? 'Edit FAQ' : 'New FAQ'} subtitle="FAQ Details">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <InputField 
                        label="Question *" 
                        name="question" 
                        value={formData.question} 
                        onChange={handleChange} 
                        error={validationErrors.question}
                    />
                    
                    <TextAreaField 
                        label="Answer *" 
                        name="answer" 
                        value={formData.answer} 
                        onChange={handleChange} 
                        rows={4}
                        error={validationErrors.answer}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {edit?.value ? 'Update FAQ' : 'Create FAQ'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default FaqForm;