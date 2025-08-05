'use client'
import React, { useState, useEffect } from "react";
import Modal from '@/Component/UI/Modal'
import {
    InputField,
    NativeSelectField,
    TextAreaField,
    Chip
} from '@/Component/UI/ReusableCom'
import { Button } from '@/Component/UI/TableFormat'
import { Trash2, X } from 'lucide-react'
import toast from "react-hot-toast";

export default function SessionForm({ sessionData, speakers, companies, onSave, onClose }) {
    // Form state
    const [formData, setFormData] = useState({
        sessionTitle: '',
        sessionDescription: '',
        sessionLocation: '',
        sessionSpeakers: [],
        sessionCollaborations: [],
        sessionInstructions: [],
        tags: []
    });
    
    const [newInstruction, setNewInstruction] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newCollaboration, setNewCollaboration] = useState({
        head: '',
        company: ''
    });

    // Initialize form with session data if available
    useEffect(() => {
        if (sessionData) {
            setFormData({
                sessionTitle: sessionData.sessionTitle || '',
                sessionDescription: sessionData.sessionDescription || '',
                sessionLocation: sessionData.sessionLocation || '',
                sessionSpeakers: sessionData.sessionSpeakers || [],
                sessionCollaborations: sessionData.sessionCollaborations || [],
                sessionInstructions: sessionData.sessionInstructions || [],
                tags: sessionData.tags || []
            });
        }
    }, [sessionData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.sessionTitle?.trim()) {
            toast.error('Session title is required');
            return;
        }

        if (!formData.sessionSpeakers || formData.sessionSpeakers.length === 0) {
            toast.error('At least one speaker is required');
            return;
        }

        const sessionPayload = {
            sessionTitle: formData.sessionTitle.trim(),
            sessionDescription: formData.sessionDescription?.trim() || '',
            sessionLocation: formData.sessionLocation?.trim() || '',
            sessionSpeakers: formData.sessionSpeakers || [],
            sessionCollaborations: formData.sessionCollaborations || [],
            sessionInstructions: formData.sessionInstructions || [],
            tags: formData.tags || []
        };
        
        onSave(sessionPayload);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            sessionTitle: '',
            sessionDescription: '',
            sessionLocation: '',
            sessionSpeakers: [],
            sessionCollaborations: [],
            sessionInstructions: [],
            tags: []
        });
        setNewInstruction('');
        setNewTag('');
        setNewCollaboration({ head: '', company: '' });
        onClose();
    }

    const handleAddInstruction = (e) => {
        e.preventDefault();
        if (newInstruction.trim()) {
            setFormData(prev => ({
                ...prev,
                sessionInstructions: [...prev.sessionInstructions, newInstruction.trim()]
            }));
            setNewInstruction('');
        }
    }

    const handleRemoveInstruction = (index) => {
        setFormData(prev => {
            const updated = [...prev.sessionInstructions];
            updated.splice(index, 1);
            return { ...prev, sessionInstructions: updated };
        });
    }

    const handleAddTag = (e) => {
        e.preventDefault();
        if (newTag?.trim()) {
            if (!formData.tags.includes(newTag.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag.trim()]
                }));
            }
            setNewTag('');
        }
    }

    const handleRemoveTag = (index) => {
        setFormData(prev => {
            const updated = [...prev.tags];
            updated.splice(index, 1);
            return { ...prev, tags: updated };
        });
    }

    const handleAddCollaboration = (e) => {
        e.preventDefault();
        if (newCollaboration.company) {
            setFormData(prev => ({
                ...prev,
                sessionCollaborations: [
                    ...prev.sessionCollaborations, 
                    { 
                        head: newCollaboration.head || '',
                        company: newCollaboration.company
                    }
                ]
            }));
            setNewCollaboration({ head: '', company: '' });
        }
    }

    const handleRemoveCollaboration = (index) => {
        setFormData(prev => {
            const updated = [...prev.sessionCollaborations];
            updated.splice(index, 1);
            return { ...prev, sessionCollaborations: updated };
        });
    }

    const handleSpeakerChange = (e) => {
        const selected = Array.from(e.target.options)
            .filter(option => option.selected)
            .map(option => option.value);
        setFormData(prev => ({ ...prev, sessionSpeakers: selected }));
    }

    return (
        <Modal isOpen={true} onClose={handleClose} title={sessionData ? 'Edit Session' : 'Add New Session'} width="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    id="sessionTitle"
                    label="Session Title"
                    name="sessionTitle"
                    value={formData.sessionTitle}
                    onChange={handleInputChange}
                    required
                />

                <TextAreaField
                    id="sessionDescription"
                    label="Description"
                    name="sessionDescription"
                    value={formData.sessionDescription}
                    onChange={handleInputChange}
                    rows={3}
                />

                <InputField
                    id="sessionLocation"
                    label="Location"
                    name="sessionLocation"
                    value={formData.sessionLocation}
                    onChange={handleInputChange}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speakers*</label>
                    <div>
                        <select
                            multiple
                            className="w-full border border-gray-300 rounded-md p-2 h-auto min-h-[100px]"
                            value={formData.sessionSpeakers}
                            onChange={handleSpeakerChange}
                        >
                            {speakers?.map((speaker) => (
                                <option key={speaker._id} value={speaker._id}>
                                    {speaker.name} ({speaker.position})
                                </option>
                            ))}
                        </select>
                        {formData.sessionSpeakers.length === 0 && (
                            <p className="text-red-500 text-xs mt-1">At least one speaker is required</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                        {formData.sessionSpeakers.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium">Selected Speakers:</p>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    {formData.sessionSpeakers.map(speakerId => {
                                        const speaker = speakers?.find(s => s._id === speakerId);
                                        return <li key={speakerId}>{speaker?.name || 'Unknown'}</li>;
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <div className="space-y-2 mb-2">
                        {formData.sessionInstructions.map((inst, index) => (
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
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddInstruction(e);
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={handleAddInstruction}
                            variant="primary"
                            className="rounded-l-none"
                            disabled={!newInstruction.trim()}
                        >
                            Add
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collaborations</label>
                    <div className="space-y-3 mb-3">
                        {formData.sessionCollaborations.map((collab, index) => {
                            const company = companies?.find(c => c?._id === collab?.company);
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
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <InputField
                            value={newCollaboration?.head}
                            onChange={(e) => setNewCollaboration(prev => ({ ...prev, head: e.target.value }))}
                            placeholder="Collaboration head name"
                        />
                        <NativeSelectField
                            value={newCollaboration?.company}
                            onChange={(e) => setNewCollaboration(prev => ({ ...prev, company: e.target.value }))}
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
                        {formData.tags.map((tag, index) => (
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
                            inputClass="rounded-r-none mt-1"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTag(e);
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={handleAddTag}
                            variant="primary"
                            className="rounded-l-none"
                            disabled={!newTag?.trim()}
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
                        {sessionData ? 'Update Session' : 'Add Session'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}