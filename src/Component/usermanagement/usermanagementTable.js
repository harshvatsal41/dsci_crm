// Component/usermanagement/usermanagementTable.js
'use client'

import React, { useState, useEffect , useCallback} from 'react';
import UserTable from './UserTable';
import RoleTable from './RoleTable';
import { Button } from '@/Component/UI/TableFormat';
import { Employee, Roles } from '@/utilities/ApiManager';
import { setLoading, setIsUpdate } from '@/Redux/Reducer/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function UserManagementTable() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const isUpdate = useSelector((state) => state.menu.isUpdate);

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const [usersData, rolesData] = await Promise.all([
        Employee(),
        Roles()
      ]);
    
      setUsers(usersData.data);
      setRoles(rolesData.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    }finally{
      dispatch(setIsUpdate(false));
      dispatch(setLoading(false));
    }
  },[dispatch]);
  
  useEffect(() => {
    fetchData();
  }, [isUpdate, fetchData]);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);




  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`py-3 px-6 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('users')}
        >
          All Users
        </button>
        <button
          className={`py-3 px-6 font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'users' ? (
          <UserTable 
            users={users} 
            roles={roles} 
          />
        ) : (
          <RoleTable 
            roles={roles} 
          />
        )}
      </div>
    </div>
  );
}