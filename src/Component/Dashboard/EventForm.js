'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { InputField, TextAreaField } from '@/Component/UI/ReusableCom';
import Modal from '@/Component/UI/Modal';

export default function EventForm({ onSuccess, onClose, eventData, isEditMode }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    edition: 1,
    websiteURL: '',
    socialMediaLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    dates: {
      start: '',
      end: ''
    },
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
      googleMapsLink: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

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
      const formPayload = new FormData();
      
      // Append all form data
      formPayload.append('title', formData.title);
      formPayload.append('year', formData.year);
      formPayload.append('edition', formData.edition);
      formPayload.append('description', formData.description);
      formPayload.append('websiteURL', formData.websiteURL);
      
      // Append nested objects
      formPayload.append('dates.start', formData.dates.start);
      formPayload.append('dates.end', formData.dates.end);
      
      formPayload.append('location.address', formData.location.address);
      formPayload.append('location.city', formData.location.city);
      formPayload.append('location.state', formData.location.state);
      formPayload.append('location.country', formData.location.country);
      formPayload.append('location.pincode', formData.location.pincode);
      formPayload.append('location.googleMapsLink', formData.location.googleMapsLink);
      formPayload.append('location.latitude', formData.location.latitude);
      formPayload.append('location.longitude', formData.location.longitude);
      
      formPayload.append('socialMediaLinks.facebook', formData.socialMediaLinks.facebook);
      formPayload.append('socialMediaLinks.instagram', formData.socialMediaLinks.instagram);
      formPayload.append('socialMediaLinks.twitter', formData.socialMediaLinks.twitter);
      formPayload.append('socialMediaLinks.linkedin', formData.socialMediaLinks.linkedin);
      formPayload.append('socialMediaLinks.youtube', formData.socialMediaLinks.youtube);

      const response = await fetch('/api/admin/data/eventoutreach', {
        method: 'POST',
        body: formPayload
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
      
      const result = await response.json();
      toast.success('Event created successfully!');
      
      if (onSuccess) {
        onSuccess(result.data);
        setFormData({
          title: '',
          year: new Date().getFullYear(),
          edition: 1,
          websiteURL: '',
          socialMediaLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: ''
          },
          dates: {
            start: '',
            end: ''
          },
          location: {
            address: '',
            latitude: 0,
            longitude: 0,
            googleMapsLink: '',
            city: '',
            state: '',
            country: '',
            pincode: ''
          },
          description: ''
        });
        onClose();
      } else {
        router.refresh();
      }
      
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInfoSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <InputField
        id="event-title"
        label="Event Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <h3 className="text-lg font-semibold">Date & Location</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        required
      />
    </div>
  );

  const renderMediaSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Social Media Links</h3>
      
      <div className="space-y-3">
        <InputField
          id="event-facebook"
          label="Facebook"
          name="socialMediaLinks.facebook"
          type="url"
          value={formData.socialMediaLinks.facebook}
          onChange={handleChange}
          placeholder="https://facebook.com/..."
          labelClass="text-xs text-gray-500"
        />
        <InputField
          id="event-instagram"
          label="Instagram"
          name="socialMediaLinks.instagram"
          type="url"
          value={formData.socialMediaLinks.instagram}
          onChange={handleChange}
          placeholder="https://instagram.com/..."
          labelClass="text-xs text-gray-500"
        />
        <InputField
          id="event-twitter"
          label="Twitter/X"
          name="socialMediaLinks.twitter"
          type="url"
          value={formData.socialMediaLinks.twitter}
          onChange={handleChange}
          placeholder="https://twitter.com/..."
          labelClass="text-xs text-gray-500"
        />
        <InputField
          id="event-linkedin"
          label="LinkedIn"
          name="socialMediaLinks.linkedin"
          type="url"
          value={formData.socialMediaLinks.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/..."
          labelClass="text-xs text-gray-500"
        />
        <InputField
          id="event-youtube"
          label="YouTube"
          name="socialMediaLinks.youtube"
          type="url"
          value={formData.socialMediaLinks.youtube}
          onChange={handleChange}
          placeholder="https://youtube.com/..."
          labelClass="text-xs text-gray-500"
        />
      </div>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Event">
    
        <div className="mb-6">
          <div className="flex border-b">
            <button
              type="button"
              onClick={() => setActiveSection('basic')}
              className={`px-4 py-2 font-medium ${activeSection === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('dateLocation')}
              className={`px-4 py-2 font-medium ${activeSection === 'dateLocation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Date & Location
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('media')}
              className={`px-4 py-2 font-medium ${activeSection === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Media & Social
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {activeSection === 'basic' && renderBasicInfoSection()}
          {activeSection === 'dateLocation' && renderDateLocationSection()}
          {activeSection === 'media' && renderMediaSection()}
          
          <div className="flex justify-between pt-6 mt-6 border-t">
            <div>
              {activeSection !== 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveSection(activeSection === 'dateLocation' ? 'basic' : 'dateLocation')}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
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
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Creating Event...' : 'Create Event'}
                </button>
              )}
            </div>
          </div>
        </form>
      
    </Modal>
  );
}