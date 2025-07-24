'use client'
import {useEffect, useState} from 'react'
import UserManagementTable from '@/Component/usermanagement/usermanagementTable'
import UserManagementForm from '@/Component/usermanagement/userManagementForm'
import RoleForm from '@/Component/usermanagement/RoleForm'


export default function UserManagement() {
    return (
        <div className='flex flex-col gap-4 p-2'>
            <UserManagementTable />
            <UserManagementForm/>
            <RoleForm/>
        </div>
    )
}
