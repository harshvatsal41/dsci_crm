// app/dashboard/layout.jsx
'use client';
import { useState } from 'react';
import Sidebar from '@/Component/Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container flex ">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <main className={`main-content flex-1  transition-all max-h-screen overflow-hidden duration-300 ${sidebarOpen ? 'ml-65' : 'ml-14'}`}>
        {children}
      </main>
    </div>
  );
}