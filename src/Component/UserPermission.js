// hooks/usePermissions.js
'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPermissions } from '@/Redux/Reducer/menuSlice';

export const UserPermissions = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPermissions());
  }, [dispatch]);
};