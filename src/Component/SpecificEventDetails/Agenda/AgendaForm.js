'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Modal from '@/Component/UI/Modal' // Assuming you have this component
import {
  InputField,
  NativeSelectField,
  TextAreaField,
  InfoCard,
  DetailItem,
  Skeleton
} from '@/Component/UI/ReusableCom' // Your shared components

const AgendaForm = ({ eventId, agendaData = null, onSuccess, onClose }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [speakers, setSpeakers] = useState([])
  const [companies, setCompanies] = useState([])
  const [timeConflict, setTimeConflict] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
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

  // Load initial data if editing
  useEffect(() => {
    if (agendaData) {
      reset({
        ...agendaData,
        date: agendaData.date.split('T')[0],
        startTime: new Date(agendaData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(agendaData.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    }

    // Fetch speakers and companies
    const fetchData = async () => {
      try {
        const [speakersRes, companiesRes] = await Promise.all([
          axios.get('/api/speakers'),
          axios.get('/api/companies')
        ])
        setSpeakers(speakersRes.data)
        setCompanies(companiesRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [agendaData, reset])

  // Watch for time changes to check conflicts
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'startTime' || name === 'endTime' || name === 'date') {
        checkTimeConflict(value)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const checkTimeConflict = async (formData) => {
    if (!formData.startTime || !formData.endTime || !formData.date) return
    
    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`)
      
      if (endDateTime <= startDateTime) {
        setTimeConflict('End time must be after start time')
        return
      }

      const res = await axios.get(`/api/agenda/check-conflict?eventId=${eventId}&start=${startDateTime.toISOString()}&end=${endDateTime.toISOString()}`)
      setTimeConflict(res.data.conflict ? `Conflicts with: ${res.data.conflictingTitle}` : null)
    } catch (error) {
      console.error('Error checking time conflict:', error)
    }
  }

  const onSubmit = async (data) => {
    if (timeConflict) {
      toast.error('Please resolve the time conflict before saving')
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        ...data,
        startTime: new Date(`${data.date}T${data.startTime}`).toISOString(),
        endTime: new Date(`${data.date}T${data.endTime}`).toISOString(),
        date: new Date(data.date).toISOString()
      }

      let response
      if (agendaData) {
        response = await axios.put(`/api/agenda/${agendaData._id}`, payload)
        toast.success('Agenda updated successfully')
      } else {
        response = await axios.post('/api/agenda', payload)
        toast.success('Agenda created successfully')
      }

      onSuccess?.(response.data)
      onClose?.()
    } catch (error) {
      console.error('Error saving agenda:', error)
      toast.error(error.response?.data?.message || 'Failed to save agenda')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setValue('category', [...watch('category'), newCategory.trim()])
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (catToRemove) => {
    const updated = categories.filter(cat => cat !== catToRemove)
    setCategories(updated)
    setValue('category', updated)
  }

  const handleAddSession = (sessionData) => {
    const updatedSessions = [...watch('session')]
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
    const updated = [...watch('session')]
    updated.splice(index, 1)
    setValue('session', updated)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={agendaData ? 'Edit Agenda Item' : 'Create New Agenda Item'}
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
            {timeConflict && (
              <p className="text-sm text-red-500">{timeConflict}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {watch('category')?.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <InputField
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="flex-1"
                inputClass="rounded-r-none"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                Add
              </button>
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
            <button
              type="button"
              onClick={() => setShowSessionForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Session
            </button>
          </div>

          {watch('session')?.length > 0 ? (
            <div className="space-y-3">
              {watch('session').map((session, index) => (
                <InfoCard key={index} title={session.sessionTitle || `Session ${index + 1}`}>
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      {session.sessionDescription && (
                        <DetailItem label="Description" value={session.sessionDescription} />
                      )}
                      {session.sessionLocation && (
                        <DetailItem label="Location" value={session.sessionLocation} />
                      )}
                      {session.sessionSpeakers?.length > 0 && (
                        <DetailItem
                          label="Speakers"
                          value={session.sessionSpeakers
                            .map(speakerId => {
                              const speaker = speakers.find(s => s._id === speakerId)
                              return speaker ? speaker.name : 'Unknown'
                            })
                            .join(', ')}
                        />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditSession(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSession(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </InfoCard>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sessions added yet.</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : agendaData ? 'Update' : 'Create'}
          </button>
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

const SessionForm = ({ sessionData, speakers, companies, onSave, onClose }) => {
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: sessionData || {
      sessionTitle: '',
      sessionDescription: '',
      sessionLocation: '',
      sessionSpeakers: [],
      sessionCollaborations: [],
      sessionInstructions: [],
      tags: []
    }
  })

  const [newInstruction, setNewInstruction] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCollaboration, setNewCollaboration] = useState({
    head: '',
    company: ''
  })

  const onSubmit = (data) => {
    onSave(data)
  }

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      const current = watch('sessionInstructions') || []
      setValue('sessionInstructions', [...current, newInstruction.trim()])
      setNewInstruction('')
    }
  }

  const handleRemoveInstruction = (index) => {
    const updated = [...watch('sessionInstructions')]
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
    const updated = [...watch('tags')]
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
    const updated = [...watch('sessionCollaborations')]
    updated.splice(index, 1)
    setValue('sessionCollaborations', updated)
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={sessionData ? 'Edit Session' : 'Add New Session'} width="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          id="sessionTitle"
          label="Session Title"
          {...register('sessionTitle')}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Speakers (required)</label>
          <Controller
            name="sessionSpeakers"
            control={control}
            rules={{ required: 'At least one speaker is required' }}
            render={({ field }) => (
              <select
                multiple
                className="w-full border border-gray-300 rounded-md p-2"
                {...field}
              >
                {speakers.map((speaker) => (
                  <option key={speaker._id} value={speaker._id}>
                    {speaker.name} ({speaker.designation})
                  </option>
                ))}
              </select>
            )}
          />
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
          <div className="space-y-2 mb-2">
            {watch('sessionInstructions')?.map((inst, index) => (
              <div key={index} className="flex items-center">
                <span className="flex-1 bg-gray-50 p-2 rounded">{inst}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <InputField
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="Add new instruction"
              className="flex-1"
              inputClass="rounded-r-none"
            />
            <button
              type="button"
              onClick={handleAddInstruction}
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Collaborations</label>
          <div className="space-y-3 mb-3">
            {watch('sessionCollaborations')?.map((collab, index) => {
              const company = companies.find(c => c._id === collab.company)
              return (
                <div key={index} className="border p-2 rounded">
                  <div className="flex justify-between">
                    <div>
                      {collab.head && <p className="font-medium">{collab.head}</p>}
                      <p>{company?.companyName || 'Unknown company'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCollaboration(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
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
                ...companies.map(company => ({
                  value: company._id,
                  label: company.companyName
                }))
              ]}
            />
          </div>
          <button
            type="button"
            onClick={handleAddCollaboration}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Collaboration
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {watch('tags')?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-1.5 inline-flex text-purple-400 hover:text-purple-600"
                >
                  &times;
                </button>
              </span>
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
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Session
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AgendaForm