// Component/usermanagement/UserTable.js
'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/Component/UI/TableFormat';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setFormData } from '@/Redux/Reducer/menuSlice';
import { InputField, NativeSelectField } from '../UI/ReusableCom';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function UserTable({ users, roles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();

  // Apply filters when search term or role changes
  useEffect(() => {
    let result = users;
    
    if (selectedRole !== 'all') {
      result = result.filter(user => {
        const userRole = roles.find(r => r._id === user.role);
        return userRole && userRole.name === selectedRole;
      });
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.contactNo.includes(term)
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, selectedRole, users, roles]);

  const handleEditUser = (user) => {
    dispatch(setFormData({ action: 'editUser', data: user, status: 'true' }));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <NativeSelectField
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              options={[
                { value: 'all', label: 'All Roles' },
                ...roles.map(role => ({ value: role.name, label: role.name })),
              ]}
            />
          </div>
          
          <div className="relative">
            <InputField
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          {/* <Button 
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => setFormOpen({action:'createUser', data:{}, status:'true'})}
          >
            Invite User
          </Button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, index) => {
              const role = roles.find(r => r._id === user.role);
              return (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user?.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role ? role?.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.contactNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user?.isDisabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user?.isDisabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="flex gap-1 items-center justify-center text-blue-600 hover:text-blue-900"
                      onClick={() =>  {role?.name==="Admin" ? toast.error("Admin cannot be edited") : handleEditUser(user)}}
                    >
                      <Edit className="mb-1" size={15} />
                      Edit
                    </button>
                    {/* <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteUser(user?._id)}
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your criteria
        </div>
      )}
    </div>
  );
}