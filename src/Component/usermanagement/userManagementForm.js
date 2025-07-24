'use client';
import React, { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import { InputField, NativeSelectField, InfoCard } from "../UI/ReusableCom";
import { motion } from "framer-motion";
import { Save, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import {Employee, Roles } from "@/utilities/ApiManager";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../UI/TableFormat";
import { setLoading, setIsUpdate, setFormData } from "@/Redux/Reducer/menuSlice";

const initialState = {
    username: "",
    email: "",
    contactNo: "",
    password: "",
    role: "",
    isDisabled: false,
    isSuperAdmin: false,
    isVerified: false
}
const UserManagementForm = () => {
  // Form state
  const [formData, setformData] = useState(initialState);
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const data = useSelector((state) => state.menu.formData);
  // Load initial data and roles when modal opens
  const fetchRoles = async () => {
    const rolesData = await Roles();
    if(rolesData.status || rolesData.status=== 'success'){
      setRoles(rolesData.data);
    }
  };
  useEffect(() => {
    fetchRoles();
    if (data.action === 'editUser' ) {
        setformData({
          username: data.data?.username || "",
          email: data.data?.email || "",
          contactNo: data.data?.contactNo || "",
          password: "", // Password intentionally blank for security
          role: data.data?.role || "",
          isDisabled: data.data?.isDisabled || false,
          isSuperAdmin: data.data?.isSuperAdmin || false,
          isVerified: data.data?.isVerified || false
        });
      } else {
        // Reset form for new user
        setformData({
          username: "",
          email: "",
          contactNo: "",
          password: "",
          role: "",
          isVerified: false
        });
      }
      
    
  }, [data.action]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setformData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
  };

  // Form validation
  const validateForm = () => {
    if (!formData.role) {
      toast.error("Role is required");
    }
    
    return true;
  };

  const onSuccess = () => {
   dispatch(setIsUpdate(true));
   onClose();
};

const onClose = () => {
    dispatch(setFormData({ 
      action: null,
      data: {},
      status: ''
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    
    if (validateForm()) {
      try {
        if(data.action === 'editUser'){
          const submitData = new FormData();
          submitData.append('roleId', formData.role);
          submitData.append('isVerified', formData.isVerified);
          
          const response = await Employee(submitData, 'POST', { Id: data.data._id });
          if(response.status || response.status === 'success'){
            toast.success("User updated successfully");
            onSuccess();
          }
        }else{
          const response = await Employee(formData, 'POST');
          if(response.status || response.status === 'success'){
            toast.success("User added successfully");
            onSuccess();
          }
        }
        
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }finally{
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <Modal 
      isOpen={data.status== 'true' && data.action === 'editUser' } 
      onClose={onClose} 
      title={data.action === 'editUser' ? "Edit User" : "Add New User"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information Card */}
        <InfoCard title="Basic Information">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <InputField
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              readOnly={data.action === 'editUser'}
              icon={<User size={16} className="text-gray-500" />}
            />
            
            <InputField
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              readOnly={data.action === 'editUser'}
              icon={<Mail size={16} className="text-gray-500" />}
            />
            
            <InputField
              id="contactNo"
              label="Contact Number"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              readOnly={data.action === 'editUser'}
              icon={<Phone size={16} className="text-gray-500" />}
            />
            
            {/* <div className="relative">
              <InputField
                id="password"
                label={`Password ${action === 'add' ? '(required)' : '(optional)'}`}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={action === 'add' ? "Create password" : "Change password"}
                required={action === 'add'}
                icon={<Lock size={16} className="text-gray-500" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div> */}
          </motion.div>
        </InfoCard>

        {/* Role & Permissions Card */}
        <InfoCard title="Role & Permissions">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-4"
          >
            <NativeSelectField
              id="role"
              label="User Role"
              name="role"
              value={formData?.role}
              onChange={handleChange}
              options={roles?.map((role) => ({ value: role._id, label: role.name }))}
              placeholder="Select a role"
              required
            />
            
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Verified Account</span>
              </label>
            </div>
          </motion.div>
        </InfoCard>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-end space-x-3 pt-4"
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
              <Save size={16} className="mr-1" />
              Update User
          </Button>
        </motion.div>
      </form>
    </Modal>
  );
};

export default UserManagementForm;