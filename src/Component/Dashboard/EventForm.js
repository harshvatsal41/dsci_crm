'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { set } from 'mongoose';

export default function EventForm({ onSuccess, onClose }) {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const formPayload = new FormData();
        
        // Append all form data directly
        formPayload.append('title', formData.title);
        formPayload.append('year', formData.year);
        formPayload.append('edition', formData.edition);
        formPayload.append('description', formData.description);
        formPayload.append('websiteURL', formData.websiteURL);
        
        // Append nested objects directly (they'll be properly handled by the backend)
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
        
        if (formData.coverImage) {
            formPayload.append('coverImage', formData.coverImage);
        }
      const response = await fetch('/api/admin/data/eventoutreach', {
        method: 'POST',
        body: formPayload
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create event');
        // throw new Error(errorData.message || 'Failed to create event');
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
        })
        onClose()
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
      
      <div>
        <label className="block text-sm font-medium mb-1">Event Title*</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Year*</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Edition*</label>
          <input
            type="number"
            name="edition"
            value={formData.edition}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Website URL</label>
        <input
          type="url"
          name="websiteURL"
          value={formData.websiteURL}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://example.com"
        />
      </div>
    </div>
  );

  const renderDateLocationSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Date & Location</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date*</label>
          <input
            type="datetime-local"
            name="dates.start"
            value={formData.dates.start}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date*</label>
          <input
            type="datetime-local"
            name="dates.end"
            value={formData.dates.end}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City*</label>
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State*</label>
          <input
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country*</label>
          <input
            type="text"
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Full Address*</label>
        <input
          type="text"
          name="location.address"
          value={formData.location.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code*</label>
          <input
            type="text"
            name="location.pincode"
            value={formData.location.pincode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Latitude</label>
          <input
            type="number"
            name="location.latitude"
            value={formData.location.latitude}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="any"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitude</label>
          <input
            type="number"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="any"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Google Maps Link*</label>
        <input
          type="url"
          name="location.googleMapsLink"
          value={formData.location.googleMapsLink}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://maps.google.com/..."
          required
        />
      </div>
    </div>
  );

  const renderMediaSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Social Media Links</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Facebook</label>
          <input
            type="url"
            name="socialMediaLinks.facebook"
            value={formData.socialMediaLinks.facebook}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Instagram</label>
          <input
            type="url"
            name="socialMediaLinks.instagram"
            value={formData.socialMediaLinks.instagram}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Twitter/X</label>
          <input
            type="url"
            name="socialMediaLinks.twitter"
            value={formData.socialMediaLinks.twitter}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://twitter.com/..."
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
          <input
            type="url"
            name="socialMediaLinks.linkedin"
            value={formData.socialMediaLinks.linkedin}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://linkedin.com/..."
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">YouTube</label>
          <input
            type="url"
            name="socialMediaLinks.youtube"
            value={formData.socialMediaLinks.youtube}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        
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
      </div>
    </div>
  );
}