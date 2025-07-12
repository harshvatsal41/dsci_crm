// app/dashboard/layout.jsx
'use client';
import { useState } from 'react';
import Sidebar from '@/Component/Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container  flex h-screen overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <main className={`main-content flex-1  transition-all duration-300 ${sidebarOpen ? ' ml-80' : ' ml-13'}`}>
        {children}
      </main>
    </div>
  );
}