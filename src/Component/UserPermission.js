// hooks/usePermissions.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPermissions } from '@/Redux/Reducer/menuSlice';

export const userPermissions = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPermissions());
  }, [dispatch]);
};