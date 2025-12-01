import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-aviation-500/30">
    <Sidebar />
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-aviation-900/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <Navbar />
      <main className="p-6 md:p-8 flex-1 relative z-10 overflow-y-auto h-screen scrollbar-thin">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default MainLayout;
