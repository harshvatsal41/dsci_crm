'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import {InputField, TextAreaField} from '@/Component/UI/ReusableCom';
import { Button } from '@/Component/UI/TableFormat';
import {FiEdit2, FiUpload, FiTrash2} from 'react-icons/fi';
import { BroadFocusAreaApi } from '@/utilities/ApiManager';


const initialState = {
    name: '',
    description: '',
    imageUrlPath: '',
    eventId: null
}

const FocusAreaForm = ({ edit, onSuccess, onClose }) => {
  const dispatch = useDispatch();
  const { Id } = useParams();
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (edit?.value) {
      loadFocusAreaData(edit.data);
    }
  }, [edit]);

  const loadFocusAreaData = async (data) => {
      try {
        dispatch(setLoading(true));
        setFormData({
            name: data?.name || '',
            description: data?.description || '',
            image: data?.imageUrlPath || '',
        });
        setPreviewImage(data?.imageUrlPath);
    } catch (error) {
      toast.error('Failed to load focus area data');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and SVG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage('');
    if (!edit?.value) {
      setFormData(prev => ({ ...prev, imageUrlPath: '' }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('eventId', Id);
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      let response;
      if (edit?.value) {
        response = await BroadFocusAreaApi(submitData, 'POST', { Id: edit?.data?._id });
        console.log("Response", response)
        if(response.statusCode === 200 || response.statusCode === 201 || response.status=="success"){
            onSuccess();
          toast.success(response.message || 'Focus area updated successfully');
        }
      } else {
        response = await BroadFocusAreaApi(submitData, 'POST');
      }
      if(response.statusCode === 201){
        onSuccess();
        toast.success(response.message || 'Operation Success');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal isOpen={true} onClose={() => onClose()} title={`${edit?.value ? 'Edit' : 'Create New'} Focus Area`}>
        <form onSubmit={handleSubmit} className="space-y-2 font-sans">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {!edit?.value && <span className="text-red-500">*</span>}
                </label>
                
                {previewImage ? (
                  <div className="relative group">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      <Image
                        src={previewImage}
                        alt="Focus area preview"
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload an image</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, SVG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            
            <Button type="submit">
              {edit?.value ? (
                <>
                  <FiEdit2 className="mr-2" /> Update Focus Area
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" /> Create Focus Area
                </>
              )}
            </Button>
          </div>
        </form>
    </Modal>
  );
};

export default FocusAreaForm;