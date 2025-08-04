'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Modal from '@/Component/UI/Modal'
import {
  InputField,
  NativeSelectField,
  TextAreaField,
  InfoCard,
  DetailItem,
} from '@/Component/UI/ReusableCom'
import {Button} from '@/Component/UI/TableFormat'
import { Plus, Trash2, X, Edit2, MapPin, Users, Building } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/Redux/Reducer/menuSlice'
import { SpeakerApi } from '@/utilities/ApiManager'

const AgendaForm = ({ eventId, agendaData = null, onSuccess, onClose }) => {
  
  const dispatch = useDispatch()
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const [speakers, setSpeakers] = useState([])
  const [companies, setCompanies] = useState([])
  const [timeConflict, setTimeConflict] = useState(null)
  const [isCheckingConflict, setIsCheckingConflict] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const fetchSpeaker = async () => {
    dispatch(setLoading(true))
    try {
      const res = await SpeakerApi(null, "GET", {Id: eventId });
      if (res.statusCode === 200 || res.status=== "success") {
        setSpeakers(res.data);
      }
    } catch (error) {
      toast.error('Failed to load speakers');
    } finally {
      dispatch(setLoading(false))
    }
  }

  console.log(agendaData.categories)


 
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

      onSuccess?.(response.data)
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


  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={agendaData.type==="edit" ? 'Edit Agenda Item' : 'Create New Agenda Item'}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(watch('category') || []).map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onRemove={() => handleRemoveCategory(cat)}
                  color="blue"
                />
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
            {agendaData.type === "edit" ? 'Update' : 'Create'}
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

const SessionForm = ({ sessionData, speakers, companies, onSave, onClose }) => {
  const { register, handleSubmit, control, setValue, watch } = useForm({
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Speakers</label>
          <Controller
            name="sessionSpeakers"
            control={control}
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
              inputClass="rounded-r-none"
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
              const company = companies.find(c => c._id === collab.company)
              return (
                <div key={index} className="border p-2 rounded">
                  <div className="flex justify-between">
                    <div>
                      {collab.head && <p className="font-medium">{collab.head}</p>}
                      <p>{company?.companyName || 'Unknown company'}</p>
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
                ...companies.map(company => ({
                  value: company._id,
                  label: company.companyName
                }))
              ]}
            />
          </div>
          <Button
            type="button"
            onClick={handleAddCollaboration}
            variant="success"
            disabled={!newCollaboration.company}
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
            onClick={onClose}
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

export default AgendaForm