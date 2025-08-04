'use client'
import React, { useState, useEffect } from "react";
import { useForm, Controller } from 'react-hook-form'
import Modal from '@/Component/UI/Modal'
import {
    InputField,
    NativeSelectField,
    TextAreaField,
    Chip
} from '@/Component/UI/ReusableCom'
import { Button } from '@/Component/UI/TableFormat'
import { Trash2, X } from 'lucide-react'


export default function SessionForm({ sessionData, speakers, companies, onSave, onClose }) {
    const { register, handleSubmit, control, setValue, watch, reset } = useForm({
        defaultValues: {
            sessionTitle: '',
            sessionDescription: '',
            sessionLocation: '',
            sessionSpeakers: [],
            sessionCollaborations: [],
            sessionInstructions: [],
            tags: []
        }
    })

    // Initialize form with sessionData if provided
    useEffect(() => {
        if (sessionData) {
            reset(sessionData)
        }
    }, [sessionData, reset])

    const [newInstruction, setNewInstruction] = useState('')
    const [newTag, setNewTag] = useState('')
    const [newCollaboration, setNewCollaboration] = useState({
        head: '',
        company: ''
    })

    const onSubmit = (data) => {
        onSave(data)
        handleClose()
    }

    const handleClose = () => {
        // Reset all local states
        reset()
        setNewInstruction('')
        setNewTag('')
        setNewCollaboration({ head: '', company: '' })
        onClose()
    }

    const handleAddInstruction = () => {
        if (newInstruction.trim()) {
            const current = watch('sessionInstructions') || []
            setValue('sessionInstructions', [...current, newInstruction.trim()])
            setNewInstruction('')
        }
    }

    const handleRemoveInstruction = (index) => {
        const updated = [...(watch('sessionInstructions') || [])]
        updated.splice(index, 1)
        setValue('sessionInstructions', updated)
    }

    const handleAddTag = () => {
        if (newTag.trim()) {
            const current = watch('tags') || []
            setValue('tags', [...current, newTag.trim()])
            setNewTag('')
        }
    }

    const handleRemoveTag = (index) => {
        const updated = [...(watch('tags') || [])]
        updated.splice(index, 1)
        setValue('tags', updated)
    }

    const handleAddCollaboration = () => {
        if (newCollaboration.company) {
            const current = watch('sessionCollaborations') || []
            setValue('sessionCollaborations', [...current, newCollaboration])
            setNewCollaboration({ head: '', company: '' })
        }
    }

    const handleRemoveCollaboration = (index) => {
        const updated = [...(watch('sessionCollaborations') || [])]
        updated.splice(index, 1)
        setValue('sessionCollaborations', updated)
    }

    return (
        <Modal isOpen={true} onClose={handleClose} title={sessionData ? 'Edit Session' : 'Add New Session'} width="max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    id="sessionTitle"
                    label="Session Title"
                    {...register('sessionTitle', { required: 'Session title is required' })}
                />

                <TextAreaField
                    id="sessionDescription"
                    label="Description"
                    {...register('sessionDescription')}
                    rows={3}
                />

                <InputField
                    id="sessionLocation"
                    label="Location"
                    {...register('sessionLocation')}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speakers</label>
                    <Controller
                        name="sessionSpeakers"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div>
                                <select
                                    multiple
                                    className="w-full border border-gray-300 rounded-md p-2 h-auto min-h-[100px]"
                                    value={value || []}
                                    onChange={(e) => {
                                        const options = e.target.options;
                                        const selectedValues = [];
                                        for (let i = 0; i < options.length; i++) {
                                            if (options[i].selected) {
                                                selectedValues.push(options[i].value);
                                            }
                                        }
                                        onChange(selectedValues);
                                    }}
                                >
                                    {speakers?.map((speaker) => (
                                        <option key={speaker?._id} value={speaker?._id}>
                                            {speaker?.name} ({speaker?.position})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                                {value?.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">Selected Speakers:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {value.map(speakerId => {
                                                const speaker = speakers?.find(s => s._id === speakerId);
                                                return (
                                                    <li key={speakerId}>
                                                        {speaker?.name || 'Unknown speaker'}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <div className="space-y-2 mb-2">
                        {(watch('sessionInstructions') || []).map((inst, index) => (
                            <div key={index} className="flex items-center">
                                <span className="flex-1 bg-gray-50 p-2 rounded">{inst}</span>
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveInstruction(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <InputField
                            value={newInstruction}
                            onChange={(e) => setNewInstruction(e.target.value)}
                            placeholder="Add new instruction"
                            className="flex-1"
                            inputClass="rounded-r-none mt-1"
                        />
                        <Button
                            type="button"
                            onClick={handleAddInstruction}
                            variant="primary"
                            className="rounded-l-none"
                        >
                            Add
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collaborations</label>
                    <div className="space-y-3 mb-3">
                        {(watch('sessionCollaborations') || []).map((collab, index) => {
                            const company = companies?.find(c => c?._id === collab?.company)
                            return (
                                <div key={index} className="border p-2 rounded">
                                    <div className="flex justify-between">
                                        <div>
                                            {collab?.head && <p className="font-medium">{collab?.head}</p>}
                                            <p>{company?.title || 'Unknown company'}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveCollaboration(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <InputField
                            value={newCollaboration.head}
                            onChange={(e) => setNewCollaboration({ ...newCollaboration, head: e.target.value })}
                            placeholder="Collaboration head name"
                        />
                        <NativeSelectField
                            value={newCollaboration.company}
                            onChange={(e) => setNewCollaboration({ ...newCollaboration, company: e.target.value })}
                            options={[
                                { value: '', label: 'Select company...' },
                                ...(companies?.map(company => ({
                                    value: company?._id,
                                    label: company?.title
                                })) || [])
                            ]}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={handleAddCollaboration}
                        variant="success"
                        disabled={!newCollaboration?.company}
                    >
                        Add Collaboration
                    </Button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {(watch('tags') || []).map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                onRemove={() => handleRemoveTag(index)}
                                color="purple"
                            />
                        ))}
                    </div>
                    <div className="flex">
                        <InputField
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add new tag"
                            className="flex-1"
                            inputClass="rounded-r-none"
                        />
                        <Button
                            type="button"
                            onClick={handleAddTag}
                            variant="primary"
                            className="rounded-l-none"
                        >
                            Add
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                    >
                        Save Session
                    </Button>
                </div>
            </form>
        </Modal>
    )
}