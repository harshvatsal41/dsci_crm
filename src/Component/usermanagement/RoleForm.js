'use client';
import React, { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, setLoading, setIsUpdate } from '@/Redux/Reducer/menuSlice';
import { motion } from 'framer-motion';
import { Button } from '../UI/TableFormat';
import { toast } from 'sonner';
import { Roles } from '@/utilities/ApiManager';
import EditIcon from 'lucide-react';

const initialState={
    name: '',
    description: '',
    permissions: {
      blog: { create: false, read: false, update: false, delete: false },
      colab: { create: false, read: false, update: false, delete: false },
      colabCatagory: { create: false, read: false, update: false, delete: false },
      event: { create: false, read: false, update: false, delete: false },
      faq: { create: false, read: false, update: false, delete: false },
      focusArea: { create: false, read: false, update: false, delete: false },
      speaker: { create: false, read: false, update: false, delete: false },
      testimonial: { create: false, read: false, update: false, delete: false },
      ticket: { create: false, read: false, update: false, delete: false },
      user: { create: false, read: false, update: false, delete: false },
    }
  }
const RoleForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.menu.formData);
  const [roleData, setRoleData] = useState(initialState);

  // Permission categories for display
  const permissionCategories = [
    { id: 'blog', name: 'Blog' },
    { id: 'colab', name: 'Collaboration' },
    { id: 'colabCatagory', name: 'Collaboration Category' },
    { id: 'event', name: 'Event' },
    { id: 'faq', name: 'FAQ' },
    { id: 'focusArea', name: 'Focus Area' },
    { id: 'speaker', name: 'Speaker' },
    { id: 'testimonial', name: 'Testimonial' },
    { id: 'ticket', name: 'Ticket' },
    { id: 'user', name: 'User' },
  ];

  // Initialize form when modal opens
  useEffect(() => {
    if (formData.status === 'true') {
      
      if (formData.action === 'editRole' && formData.data) {
        setRoleData({
          name: formData.data.name || '',
          description: formData.data.description || '',
          permissions: formData.data.permissions || {
            blog: { create: false, read: false, update: false, delete: false },
            colab: { create: false, read: false, update: false, delete: false },
            colabCatagory: { create: false, read: false, update: false, delete: false },
            event: { create: false, read: false, update: false, delete: false },
            faq: { create: false, read: false, update: false, delete: false },
            focusArea: { create: false, read: false, update: false, delete: false },
            speaker: { create: false, read: false, update: false, delete: false },
            testimonial: { create: false, read: false, update: false, delete: false },
            ticket: { create: false, read: false, update: false, delete: false },
            user: { create: false, read: false, update: false, delete: false },
          }
        });
      } else {
        setRoleData({
          name: '',
          description: '',
          permissions: {
            blog: { create: false, read: false, update: false, delete: false },
            colab: { create: false, read: false, update: false, delete: false },
            colabCatagory: { create: false, read: false, update: false, delete: false },
            event: { create: false, read: false, update: false, delete: false },
            faq: { create: false, read: false, update: false, delete: false },
            focusArea: { create: false, read: false, update: false, delete: false },
            speaker: { create: false, read: false, update: false, delete: false },
            testimonial: { create: false, read: false, update: false, delete: false },
            ticket: { create: false, read: false, update: false, delete: false },
            user: { create: false, read: false, update: false, delete: false },
          }
        });
      }
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (category, permissionType, value) => {
    setRoleData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permissionType]: value
        }
      }
    }));
  };

  const handleFullAccessChange = (category, value) => {
    setRoleData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          create: value,
          read: value,
          update: value,
          delete: value
        }
      }
    }));
  };

  const onSuccess = () => {
    dispatch(setIsUpdate(true));
    onClose();
  };

  const onClose = () => {
    dispatch(setFormData({ action: null, data: {}, status: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      let response;
      const submitData = new FormData();
      submitData.append('name', roleData.name);
      submitData.append('description', roleData.description);
      submitData.append('permissions', JSON.stringify(roleData.permissions));

      if (formData.action === 'editRole') {
        response = await Roles(submitData, 'POST', { Id: formData.data._id });
      } else {
        response = await Roles(submitData, 'POST');
      }

      if (response.status || response.status === 'success') {
        toast.success(`Role ${formData.action === 'editRole' ? 'updated' : 'created'} successfully`);
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Render permission checkboxes for a category
  const renderPermissionRow = (category) => (
    <motion.div 
      key={category.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-12 gap-5 py-2 border-b border-gray-200 last:border-b-0"
    >
      <div className="col-span-3 font-medium text-gray-700">
        {category.name}
      </div>
      
      <div className="col-span-2 flex justify-center">
        <input
          type="checkbox"
          checked={Object.values(roleData.permissions[category.id]).every(Boolean)}
          onChange={(e) => handleFullAccessChange(category.id, e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded"
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <input
          type="checkbox"
          checked={roleData.permissions[category.id].create}
          onChange={(e) => handlePermissionChange(category.id, 'create', e.target.checked)}
          className="h-4 w-4 text-green-500 rounded"
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <input
          type="checkbox"
          checked={roleData.permissions[category.id].read}
          onChange={(e) => handlePermissionChange(category.id, 'read', e.target.checked)}
          className="h-4 w-4 text-blue-500 rounded"
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <input
          type="checkbox"
          checked={roleData.permissions[category.id].update}
          onChange={(e) => handlePermissionChange(category.id, 'update', e.target.checked)}
          className="h-4 w-4 text-yellow-500 rounded"
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <input
          type="checkbox"
          checked={roleData.permissions[category.id].delete}
          onChange={(e) => handlePermissionChange(category.id, 'delete', e.target.checked)}
          className="h-4 w-4 text-red-500 rounded"
        />
      </div>
    </motion.div>
  );

  return (
    <Modal 
      isOpen={formData.status== 'true' && (formData.action === 'editRole' || formData.action === 'createRole') } 
      onClose={onClose} 
      title={formData.action === 'editRole' ? "Edit Role" : "Create New Role"}
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={roleData.name}
                onChange={handleChange}
                placeholder="Enter role name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={roleData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-50 rounded-lg p-2 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Role Permissions</h3>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-12 flex gap-2 pb-2 border-b border-gray-300 font-semibold text-gray-700">
              <div className="col-span-3">Menu</div>
              <div className="col-span-2 text-center">Full</div>
              <div className="col-span-1 text-center">Create</div>
              <div className="col-span-1 text-center">Read</div>
              <div className="col-span-1 text-center">Update</div>
              <div className="col-span-1 text-center">Delete</div>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {permissionCategories.map(renderPermissionRow)}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-end space-x-3 pt-2"
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
          >
            {formData.action === 'editRole' ? 'Update Role' : 'Create Role'}
          </Button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default RoleForm;