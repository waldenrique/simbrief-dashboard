import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">
      <Navbar />
      <main className="p-6 flex-1">{children}</main>
    </div>
  </div>
);

export default MainLayout;
