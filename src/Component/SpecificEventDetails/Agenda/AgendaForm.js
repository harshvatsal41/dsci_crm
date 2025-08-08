'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import Modal from '@/Component/UI/Modal'
import {
  InputField,
  NativeSelectField,
  TextAreaField,
  InfoCard,
  DetailItem,
  Chip
} from '@/Component/UI/ReusableCom'
import { Button } from '@/Component/UI/TableFormat'
import { Plus, Trash2, X, Edit2, MapPin, Users, Building } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/Redux/Reducer/menuSlice'
import SessionForm from './SessionForm'
import { SpeakerApi, CollaborationApi, AgendaApi } from '@/utilities/ApiManager'
import { useParams } from 'next/navigation'


const AgendaForm = ({ eventId, agendaData = null, onSuccess, onClose }) => {
  const dispatch = useDispatch()
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const [speakers, setSpeakers] = useState([])
  const [companies, setCompanies] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [categoryInputType, setCategoryInputType] = useState('select')
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    yeaslyEventId: eventId,
    day: 'Day 1',
    date: new Date().toISOString().split('T')[0],
    type: 'Keynote',
    startTime: '',
    endTime: '',
    category: [],
    session: []
  })

  // Helper function to convert UTC time to local time string (HH:MM)
  const utcToLocalTimeString = (utcDateString) => {
    if (!utcDateString) return '';
    const date = new Date(utcDateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Helper function to get local date string from UTC
  const utcToLocalDateString = (utcDateString) => {
    if (!utcDateString) return new Date().toISOString().split('T')[0];
    const date = new Date(utcDateString);
    return date.toISOString().split('T')[0];
  };

  const fetchData = useCallback(async () => {
    try {
      const [speakersResponse, companiesResponse] = await Promise.all([
        SpeakerApi(null, 'GET', { Id: eventId }),
        CollaborationApi(null, 'GET', { Id: eventId })
      ])
      
      if (speakersResponse?.statusCode === 200 || speakersResponse?.status === "success") {
        setSpeakers(speakersResponse.data || [])
      }
      
      if (companiesResponse?.statusCode === 200 || companiesResponse?.status === "success") {
        setCompanies(companiesResponse.data || [])
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching speakers and companies')
    }
  }, [eventId])

  useEffect(() => {
    fetchData()
    
    // Initialize form with agenda data if available
    if (agendaData) {
      setFormData({
        title: agendaData.title || '',
        description: agendaData.description || '',
        yeaslyEventId: eventId,
        day: agendaData.day || 'Day 1',
        date: utcToLocalDateString(agendaData.date),
        type: agendaData.type || 'Keynote',
        startTime: utcToLocalTimeString(agendaData.startTime),
        endTime: utcToLocalTimeString(agendaData.endTime),
        category: agendaData.category || [],
        session: agendaData.session || []
      })
    }
  }, [eventId, agendaData, fetchData])

  const formatDateTime = (dateStr, timeStr) => {
    const timeWithSeconds = timeStr.includes(':') && timeStr.split(':').length === 2 
      ? `${timeStr}:00` 
      : timeStr;
    return new Date(`${dateStr}T${timeWithSeconds}`).toISOString()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSessionChange = (sessions) => {
    setFormData(prev => ({ ...prev, session: sessions }));
  }

  const handleCategoryChange = (categories) => {
    setFormData(prev => ({ ...prev, category: categories }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
  
    if (!formData.date) {
      toast.error('Date is required');
      return;
    }
  
    if (formData.endTime <= formData.startTime) {
      toast.error('End time must be after start time');
      return;
    }
  
    dispatch(setLoading(true));
  
    try {
      const payload = {
        title: formData.title,
        description: formData.description || '',
        yeaslyEventId: formData.yeaslyEventId,
        day: formData.day,
        date: formatDateTime(formData.date, '00:00:00'),
        type: formData?.type || 'Keynote',
        startTime: formatDateTime(formData.date, formData.startTime),
        endTime: formatDateTime(formData.date, formData.endTime),
        category: formData?.category || [],
        session: (formData?.session || []).map(session => ({
          sessionTitle: session.sessionTitle || '',
          sessionDescription: session.sessionDescription || '',
          sessionLocation: session.sessionLocation || '',
          sessionSpeakers: session.sessionSpeakers || [],
          sessionCollaborations: session.sessionCollaborations || [],
          sessionInstructions: session.sessionInstructions || [],
          tags: session.tags || []
        }))
      };
  
      const form = new FormData();
  
      form.append('title', payload.title);
      form.append('description', payload.description);
      form.append('yeaslyEventId', payload.yeaslyEventId);
      form.append('day', payload.day);
      form.append('date', payload.date);
      form.append('type', payload?.type);
      form.append('startTime', payload.startTime);
      form.append('endTime', payload.endTime);
      form.append('category', JSON.stringify(payload.category));
      form.append('session', JSON.stringify(payload.session));
      const method = agendaData?._id ? 'PUT' : 'POST'
      const response = await AgendaApi(form, method, { Id:agendaData?._id ? agendaData?._id : eventId })

      if (response?.statusCode === 200 || response?.status === "success"  || response?.statusCode === 202) {
        toast.success(agendaData?._id ? 'Agenda updated successfully' : 'Agenda created successfully');
        onSuccess()
      } else {
        toast.error(response?.message || 'Failed to save agenda')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save agenda')
    } finally {
      dispatch(setLoading(false));
    }
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (newCategory.trim()) {
      if (!formData.category.includes(newCategory.trim())) {
        const updatedCategories = [...formData.category, newCategory.trim()]
        handleCategoryChange(updatedCategories)
        setNewCategory('')
      }
    }
  }

  const handleRemoveCategory = (catToRemove) => {
    const updated = formData.category.filter(cat => cat !== catToRemove)
    handleCategoryChange(updated)
  }

  const handleAddSession = (sessionData) => {
    const updatedSessions = [...formData.session]
    if (currentSession !== null) {
      updatedSessions[currentSession] = sessionData
    } else {
      updatedSessions.push(sessionData)
    }
    handleSessionChange(updatedSessions)
    setShowSessionForm(false)
    setCurrentSession(null)
  }

  const handleEditSession = (index) => {
    setCurrentSession(index)
    setShowSessionForm(true)
  }

  const handleRemoveSession = (index) => {
    const updated = [...formData.session]
    updated.splice(index, 1)
    handleSessionChange(updated)
  }

  const existingCategories = [
    'Opening', 'Technology', 'Healthcare', 'Finance', 
    'Education', 'Entertainment', 'Networking'
  ]

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={agendaData?._id ? 'Edit Agenda Item' : 'Create New Agenda Item'}
        width="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="title"
              label="Title"
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />

            <NativeSelectField
              id="type"
              label="Session Type"
              required
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Session Type' },
                { value: 'Keynote', label: 'Keynote' },
                { value: 'Panel', label: 'Panel Discussion' },
                { value: 'Workshop', label: 'Workshop' },
                { value: 'Breakout', label: 'Breakout Session' },
                { value: 'Networking', label: 'Networking' },
                { value: 'Special', label: 'Special Event' }
              ]}
            />

            <NativeSelectField
              id="day"
              label="Day"
              required
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              options={[
                { value: 'Day 1', label: 'Day 1' },
                { value: 'Day 2', label: 'Day 2' },
                { value: 'Day 3', label: 'Day 3' },
                { value: 'Day 4', label: 'Day 4' },
                { value: 'Day 5', label: 'Day 5' }
              ]}
            />

            <InputField
              id="date"
              label="Date"
              type="date"
              required
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="startTime"
                  label="Start Time"
                  type="time"
                  required
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                />
                <InputField
                  id="endTime"
                  label="End Time"
                  type="time"
                  required
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              
              <div className="flex items-center space-x-4 mb-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={categoryInputType === 'select'}
                    onChange={() => setCategoryInputType('select')}
                  />
                  <span className="ml-2">Select from existing</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={categoryInputType === 'manual'}
                    onChange={() => setCategoryInputType('manual')}
                  />
                  <span className="ml-2">Add manually</span>
                </label>
              </div>

              {categoryInputType === 'select' ? (
                <div className="space-y-2">
                  <NativeSelectField
                    id="categorySelect"
                    label="Select Category"
                    options={[
                      { value: '', label: 'Select Category', disabled: true },
                      ...existingCategories.map(cat => ({
                        value: cat,
                        label: cat
                      }))
                    ]}
                    onChange={(e) => {
                      const selectedCat = e.target.value;
                      if (selectedCat) {
                        if (!formData.category.includes(selectedCat)) {
                          handleCategoryChange([...formData.category, selectedCat]);
                        }
                        // Reset the select to show the default option
                        e.target.value = '';
                      }
                    }}
                    value=""
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex">
                    <InputField
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category"
                      className="flex-1"
                      inputClass="rounded-r-none mt-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      variant="primary"
                      className="rounded-l-none"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.category.map((cat) => (
                  <div
                    key={cat}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="ml-2 text-blue-600 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TextAreaField
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Sessions</h4>
              <Button
                type="button"
                onClick={() => {
                  setCurrentSession(null);
                  setShowSessionForm(true);
                }}
                variant="success"
                icon={<Plus size={16} />}
              >
                Add Session
              </Button>
            </div>

            {formData.session.length > 0 ? (
              <div className="space-y-3">
                {formData.session.map((session, index) => (
                  <InfoCard 
                    key={index} 
                    title={session.sessionTitle || `Session ${index + 1}`}
                    actions={
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          onClick={() => handleEditSession(index)}
                          variant="ghost"
                          size="sm"
                          icon={<Edit2 size={14} />}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleRemoveSession(index)}
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {session.sessionDescription && (
                        <DetailItem label="Description" value={session.sessionDescription} />
                      )}
                      {session.sessionLocation && (
                        <DetailItem 
                          label="Location" 
                          value={session.sessionLocation}
                          icon={<MapPin size={14} />}
                        />
                      )}
                      {session.sessionSpeakers?.length > 0 && (
                        <DetailItem
                          label="Speakers"
                          value={session.sessionSpeakers
                            .map(speakerId => {
                              const speaker = speakers.find(s => s._id === speakerId)
                              return speaker ? `${speaker.name} (${speaker.position})` : 'Unknown'
                            })
                            .join(', ')}
                          icon={<Users size={14} />}
                        />
                      )}
                      {session.sessionCollaborations?.length > 0 && (
                        <DetailItem
                          label="Collaborations"
                          value={session.sessionCollaborations
                            .map(collab => {
                              const company = companies.find(c => c._id === collab.company)
                              return `${collab.head || 'Head'}: ${company?.title || 'Unknown'}`
                            })
                            .join(', ')}
                          icon={<Building size={14} />}
                        />
                      )}
                    </div>
                  </InfoCard>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No sessions added yet.</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {agendaData?._id ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Session Form Modal */}
      {showSessionForm && (
        <SessionForm
          sessionData={currentSession !== null ? formData.session[currentSession] : null}
          speakers={speakers}
          companies={companies}
          onSave={handleAddSession}
          onClose={() => {
            setShowSessionForm(false)
            setCurrentSession(null)
          }}
          isEditMode={currentSession !== null}
        />
      )}
    </>
  )
}

export default AgendaForm