'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { InputField, TextAreaField } from '@/Component/UI/ReusableCom';
import Modal from '@/Component/UI/Modal';
import { EventApi } from '@/utilities/ApiManager';

const initialState = {
  title: '',
  description: '',
  edition: 1,
  year: new Date().getFullYear(),
  websiteURL: '',
  dates: {  // Initialize dates object
    start: '',
    end: ''
  },
  location: {
    address: '',
    city: '',
    country: '',
    googleMapsLink: '',
    latitude: 0,
    longitude: 0,
    pincode: '',
    state: ''
  },
  socialMediaLinks: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: ''
  }
};

export default function EventForm({ onSuccess, onClose, eventData = {} }) {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Initialize form data based on edit mode
  useEffect(() => {
    if (eventData?.editMode) {
      // Format dates for datetime-local inputs
      const formattedData = {
        ...eventData,
        dates: {
          start: eventData.dates.start ? formatDateForInput(eventData.dates.start) : '',
          end: eventData.dates.end ? formatDateForInput(eventData.dates.end) : ''
        }
      };
      setFormData(formattedData);
    } else {
      setFormData(initialState);
    }
  }, [eventData]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Use a different variable name to avoid shadowing
      const submitData = new FormData();

      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('edition', formData.edition);
      submitData.append('year', formData.year);
      submitData.append('websiteURL', formData.websiteURL);
      
      // Add nested objects as JSON strings
      submitData.append('dates', JSON.stringify({
        start: formData.dates?.start ? new Date(formData.dates.start).toISOString() : '',
        end: formData.dates?.end ? new Date(formData.dates.end).toISOString() : ''
      }));
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('socialMediaLinks', JSON.stringify(formData.socialMediaLinks));
  
      // If you have file uploads, add them here
      // if (formData.imageFile) {
      //   submitData.append('image', formData.imageFile);
      // }
  
      const method = eventData?.editMode ? 'PUT' : 'POST';
      const response = await EventApi(submitData, method, method === 'PUT' ? eventData : {});
  
      if(response.statusCode === 200){
        onSuccess(response.data);
        toast.success(`${response.message}`);
        onClose();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save event');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderSectionNavigation = () => (
    <div className="mb-6">
      <div className="flex border-b">
        {['basic', 'dateLocation', 'media'].map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeSection === section 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {section === 'basic' && 'Basic Info'}
            {section === 'dateLocation' && 'Date & Location'}
            {section === 'media' && 'Media & Social'}
          </button>
        ))}
      </div>
    </div>
  );

  const renderBasicInfoSection = () => (
    <div className="space-y-4">
      <InputField
        id="event-title"
        label="Event Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        containerClass="mb-4"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputField
          id="event-year"
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <InputField
          id="event-edition"
          label="Edition"
          name="edition"
          type="number"
          value={formData.edition}
          onChange={handleChange}
          required
        />
      </div>
      
      <TextAreaField
        id="event-description"
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        containerClass="mb-4"
      />
      
      <InputField
        id="event-website"
        label="Website URL"
        name="websiteURL"
        type="url"
        value={formData.websiteURL}
        onChange={handleChange}
        placeholder="https://example.com"
      />
    </div>
  );

  const renderDateLocationSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <InputField
          id="event-start-date"
          label="Start Date"
          name="dates.start"
          type="datetime-local"
          value={formData.dates.start}
          onChange={handleChange}
          required
        />
        <InputField
          id="event-end-date"
          label="End Date"
          name="dates.end"
          type="datetime-local"
          value={formData.dates.end}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <InputField
          id="event-city"
          label="City"
          name="location.city"
          value={formData.location.city}
          onChange={handleChange}
          required
        />
        <InputField
          id="event-state"
          label="State"
          name="location.state"
          value={formData.location.state}
          onChange={handleChange}
          required
        />
        <InputField
          id="event-country"
          label="Country"
          name="location.country"
          value={formData.location.country}
          onChange={handleChange}
          required
        />
      </div>
      
      <InputField
        id="event-address"
        label="Full Address"
        name="location.address"
        value={formData.location.address}
        onChange={handleChange}
        required
        containerClass="mb-4"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          id="event-pincode"
          label="Postal Code"
          name="location.pincode"
          value={formData.location.pincode}
          onChange={handleChange}
          required
        />
        <InputField
          id="event-latitude"
          label="Latitude"
          name="location.latitude"
          type="number"
          value={formData.location.latitude}
          onChange={handleChange}
          step="any"
        />
        <InputField
          id="event-longitude"
          label="Longitude"
          name="location.longitude"
          type="number"
          value={formData.location.longitude}
          onChange={handleChange}
          step="any"
        />
      </div>
      
      <InputField
        id="event-gmaps"
        label="Google Maps Link"
        name="location.googleMapsLink"
        type="url"
        value={formData.location.googleMapsLink}
        onChange={handleChange}
        placeholder="https://maps.google.com/..."
        containerClass="mt-4"
      />
    </div>
  );

  const renderMediaSection = () => (
    <div className="space-y-4">
      {Object.entries(formData.socialMediaLinks).map(([platform, value]) => (
        <InputField
          key={platform}
          id={`event-${platform}`}
          label={platform.charAt(0).toUpperCase() + platform.slice(1)}
          name={`socialMediaLinks.${platform}`}
          type="url"
          value={value}
          onChange={handleChange}
          placeholder={`https://${platform}.com/...`}
          containerClass="mb-3"
        />
      ))}
    </div>
  );

  const renderFooterButtons = () => (
    <div className="flex justify-between pt-6 mt-6 border-t">
      <div>
        {activeSection !== 'basic' && (
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'dateLocation' ? 'basic' : 'dateLocation')}
            className="px-4 py-2 text-sm border rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
      </div>
      <div className="flex gap-3">
        {activeSection !== 'media' ? (
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'basic' ? 'dateLocation' : 'media')}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {isSubmitting 
              ? eventData?.editMode ? 'Updating...' : 'Creating...' 
              : eventData?.editMode ? 'Update Event' : 'Create Event'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={eventData?.editMode ? 'Edit Event' : 'Create New Event'}
    >
      <form onSubmit={handleSubmit}>
        {renderSectionNavigation()}
        
        {activeSection === 'basic' && renderBasicInfoSection()}
        {activeSection === 'dateLocation' && renderDateLocationSection()}
        {activeSection === 'media' && renderMediaSection()}
        
        {renderFooterButtons()}
      </form>
    </Modal>
  );
}