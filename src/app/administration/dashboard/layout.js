// app/dashboard/layout.jsx
'use client';
import { useState } from 'react';
import Sidebar from '@/Component/Dashboard/Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container flex h-screen overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <main className={`main-content flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-80' : ''}`}>
        {children}
      </main>
    </div>
  );
}