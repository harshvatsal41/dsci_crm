'use client'
import { createSlice } from '@reduxjs/toolkit';
import { FiMenu,FiMessageSquare } from 'react-icons/fi';
import { createSelector } from '@reduxjs/toolkit';

const initialState = {
  userRole: typeof window !== "undefined" ? localStorage.getItem("dsciAuthRole") || "" : "", 
  loading: false,
  error: null,
  menuItems: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      accessRoles: ['Admin', 'EVENT_MANAGER', 'CONTENT_MANAGER'],
    },
    {
      id: 'Focus',
      title: 'Focus Area',
      icon: 'event',
      accessRoles: ['Admin', 'EVENT_MANAGER', 'CONTENT_MANAGER'],
    },
    {
      id: 'Speakers',
      title: 'Speakers',
      icon: 'users',
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'Agenda',
      title: 'Agenda',
      icon: 'file-text',
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'Collaboration',
      title: 'Collaboration',
      icon: 'FcCollaboration',
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'FAQ',
      title: 'FAQ',
      icon: 'file-text',
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'Testimonial',
      title: 'Testimonial',
      icon: 'message-square', // Using FiMessageSquare icon
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'Navbar',
      title: 'Navbar',
      icon: 'menu', // Using FiMenu icon
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'Ticketing',
      title: 'Ticketing',
      icon: 'ticket', 
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    {
      id: 'Blogs',
      title: 'Blogs',
      icon: 'file-text', 
      accessRoles: ['Admin', 'REPORT_MANAGER'],
    },
    
    
  ]
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  }
});

const selectMenuItems = (state) => state.menu.menuItems;
const selectUserRole = (state) => state.menu.userRole;

const filterByRole = (items, userRole) => {
  return items
    .filter(item => !item.accessRoles || item.accessRoles.includes(userRole))
    .map(item => ({
      ...item,
      children: item.children ? filterByRole(item.children, userRole) : undefined
    }));
};

export const selectFilteredMenu = createSelector(
  [selectMenuItems, selectUserRole],
  (menuItems, userRole) => {
    if (!userRole) return [];
    return filterByRole(menuItems, userRole);
  }
);

// Selector to check if user has access to a specific path
export const selectHasAccessToPath = (path) => (state) => {
  if (!state.menu.userRole) return false;
  
  const checkAccess = (items) => {
    return items.some(item => {
      if (item.path === path) {
        return !item.accessRoles || item.accessRoles.includes(state.menu.userRole);
      }
      if (item.children) {
        return checkAccess(item.children);
      }
      return false;
    });
  };

  return checkAccess(state.menu.menuItems);
};

export const { setLoading, setError } = menuSlice.actions;
export default menuSlice.reducer;