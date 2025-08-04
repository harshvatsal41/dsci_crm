'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Modal from '@/Component/UI/Modal'
import {
  InputField,
  NativeSelectField,
  TextAreaField,
  InfoCard,
  DetailItem,
  Chip
} from '@/Component/UI/ReusableCom'
import {Button} from '@/Component/UI/TableFormat'
import { Plus, Trash2, X, Edit2, MapPin, Users, Building } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/Redux/Reducer/menuSlice'
import SessionForm from './SessionForm'
import {SpeakerApi, CollaborationApi} from '@/utilities/ApiManager'

const AgendaForm = ({ eventId, agendaData = null, onSuccess, onClose }) => {
  const dispatch = useDispatch()
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const [speakers, setSpeakers] = useState([])
  const [companies, setCompanies] = useState([])
  const [timeConflict, setTimeConflict] = useState(null)
  const [isCheckingConflict, setIsCheckingConflict] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categoryInputType, setCategoryInputType] = useState('select') // 'select' or 'manual'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      yeaslyEventId: eventId,
      day: 'Day 1',
      date: new Date().toISOString().split('T')[0],
      type: 'Keynote',
      startTime: '09:00',
      endTime: '10:00',
      category: [],
      session: []
    }
  })

  const fetchData=async ()=>{
    try {
      const [speakersResponse, companiesResponse] = await Promise.all([SpeakerApi(null,'GET',{Id: eventId}), CollaborationApi(null,'GET',{Id: eventId})])
      if((speakersResponse.statusCode === 200 || speakersResponse.statusCode === 203 || speakersResponse.status === "success") && (companiesResponse.statusCode === 200 || companiesResponse.statusCode === 203 || companiesResponse.status === "success")){
        setSpeakers(speakersResponse.data)
        setCompanies(companiesResponse.data)
      }
    } catch (error) {
      console.error('Error fetching speakers and companies:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Set initial values if editing
  useEffect(() => {
    if (agendaData?._id) {
      reset({
        ...agendaData,
        date: agendaData.date ? new Date(agendaData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        startTime: agendaData.startTime ? new Date(agendaData.startTime).toTimeString().substring(0, 5) : '09:00',
        endTime: agendaData.endTime ? new Date(agendaData.endTime).toTimeString().substring(0, 5) : '10:00',
      })
    }
  }, [agendaData, reset])

  const onSubmit = async (data) => {
    if (timeConflict) {
      toast.error('Please resolve the time conflict before saving')
      return
    }

    dispatch(setLoading(true))
    try {
      const payload = {
        ...data,
        startTime: new Date(`${data.date}T${data.startTime}`).toISOString(),
        endTime: new Date(`${data.date}T${data.endTime}`).toISOString(),
        date: new Date(data.date).toISOString()
      }

      let response
      if (agendaData?._id) {
        response = await fetch(`/api/agenda/${agendaData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        toast.success('Agenda updated successfully')
      } else {
        response = await fetch('/api/agenda', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        toast.success('Agenda created successfully')
      }

      onSuccess?.()
      onClose?.()
    } catch (error) {
      console.error('Error saving agenda:', error)
      toast.error(error.response?.data?.message || 'Failed to save agenda')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const currentCategories = watch('category') || []
      if (!currentCategories.includes(newCategory.trim())) {
        const updatedCategories = [...currentCategories, newCategory.trim()]
        setValue('category', updatedCategories)
        setNewCategory('')
      }
    }
  }

  const handleRemoveCategory = (catToRemove) => {
    const updated = (watch('category') || []).filter(cat => cat !== catToRemove)
    setValue('category', updated)
  }

  const handleAddSession = (sessionData) => {
    const updatedSessions = [...(watch('session') || [])]
    if (currentSession !== null) {
      // Update existing session
      updatedSessions[currentSession] = sessionData
    } else {
      // Add new session
      updatedSessions.push(sessionData)
    }
    setValue('session', updatedSessions)
    setShowSessionForm(false)
    setCurrentSession(null)
  }

  const handleEditSession = (index) => {
    setCurrentSession(index)
    setShowSessionForm(true)
  }

  const handleRemoveSession = (index) => {
    const updated = [...(watch('session') || [])]
    updated.splice(index, 1)
    setValue('session', updated)
  }

  // Existing categories from agendaData or default ones
  const existingCategories = agendaData?.categories || ['Opening', 'Technology']

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={agendaData?._id ? 'Edit Agenda Item' : 'Create New Agenda Item'}
      width="max-w-4xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="title"
            label="Title"
            required
            {...register('title', { required: 'Title is required' })}
            error={errors.title}
          />

          <NativeSelectField
            id="type"
            label="Session Type"
            required
            options={[
              { value: 'Keynote', label: 'Keynote' },
              { value: 'Panel', label: 'Panel Discussion' },
              { value: 'Workshop', label: 'Workshop' },
              { value: 'Breakout', label: 'Breakout Session' },
              { value: 'Networking', label: 'Networking' },
              { value: 'Special', label: 'Special Event' }
            ]}
            {...register('type', { required: 'Type is required' })}
            error={errors.type}
          />

          <NativeSelectField
            id="day"
            label="Day"
            required
            options={[
              { value: 'Day 1', label: 'Day 1' },
              { value: 'Day 2', label: 'Day 2' },
              { value: 'Day 3', label: 'Day 3' },
              { value: 'Day 4', label: 'Day 4' },
              { value: 'Day 5', label: 'Day 5' }
            ]}
            {...register('day', { required: 'Day is required' })}
            error={errors.day}
          />

          <InputField
            id="date"
            label="Date"
            type="date"
            required
            {...register('date', { required: 'Date is required' })}
            error={errors.date}
          />

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="startTime"
                label="Start Time"
                type="time"
                required
                {...register('startTime', { required: 'Start time is required' })}
                error={errors.startTime}
              />
              <InputField
                id="endTime"
                label="End Time"
                type="time"
                required
                {...register('endTime', { required: 'End time is required' })}
                error={errors.endTime}
              />
            </div>
            {isCheckingConflict && (
              <p className="text-sm text-gray-500">Checking for conflicts...</p>
            )}
            {timeConflict && (
              <p className="text-sm text-red-500">{timeConflict}</p>
            )}
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
                  options={existingCategories.map(cat => ({
                    value: cat,
                    label: cat
                  }))}
                  onChange={(e) => {
                    const selectedCat = e.target.value
                    if (selectedCat) {
                      const currentCategories = watch('category') || []
                      if (!currentCategories.includes(selectedCat)) {
                        setValue('category', [...currentCategories, selectedCat])
                      }
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
                    className="rounded-l-none  "
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {(watch('category') || []).map((cat) => (
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
          {...register('description')}
          rows={4}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Sessions</h4>
            <Button
              type="button"
              onClick={() => setShowSessionForm(true)}
              variant="success"
              icon={<Plus size={16} />}
            >
              Add Session
            </Button>
          </div>

          {(watch('session') || []).length > 0 ? (
            <div className="space-y-3">
              {(watch('session') || []).map((session, index) => (
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
                            return speaker ? `${speaker.name} (${speaker.designation})` : 'Unknown'
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
                            return `${collab.head}: ${company?.companyName || 'Unknown'}`
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

      {/* Session Form Modal */}
      {showSessionForm && (
        <SessionForm
          sessionData={currentSession !== null ? watch('session')[currentSession] : null}
          speakers={speakers}
          companies={companies}
          onSave={handleAddSession}
          onClose={() => {
            setShowSessionForm(false)
            setCurrentSession(null)
          }}
        />
      )}
    </Modal>
  )
}

export default AgendaForm