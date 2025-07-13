// app/dashboard/layout.jsx
'use client';
import { useState } from 'react';

export default function DashboardLayout({ children }) {

  return (
    <div className="dashboard-container  flex h-screen overflow-hidden">

      <main className={`main-content flex-1 transition-all px-4 duration-300`}>
        {children}
      </main>
    </div>
  );
}