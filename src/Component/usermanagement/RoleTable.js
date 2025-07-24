// Component/usermanagement/RoleTable.js
'use client'

import React from 'react';
import { Button } from '@/Component/UI/TableFormat';
import { useDispatch } from 'react-redux';
import { setFormData } from '@/Redux/Reducer/menuSlice';
import { EditIcon } from 'lucide-react';

export default function RoleTable({ roles}) {
  const dispatch = useDispatch();
  const handleEditRole = (role) => {
    dispatch(setFormData({ action: 'editRole', data: role, status: 'true' }));
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => dispatch(setFormData({action:'createRole', data:{}, status:'true'}))}
        >
          Add Role
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role, index) => (
              <tr key={role._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {role.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {role.description || 'No description'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    className="text-blue-600 flex items-center gap-1 hover:text-blue-900 mr-3"
                    onClick={() => handleEditRole(role)}
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit
                  </button>
                  {/* <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => onDeleteRole(role._id)}
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}