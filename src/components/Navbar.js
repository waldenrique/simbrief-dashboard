import React from 'react';

const Navbar = () => (
  <header className="glass-panel border-b border-slate-800/50 px-6 py-4 sticky top-0 z-40 backdrop-blur-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-aviation-500 rounded-full animate-pulse"></div>
        <h1 className="text-lg font-semibold text-slate-200">SimBrief Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-slate-500 font-mono">v1.0.0</span>
      </div>
    </div>
  </header>
);

export default Navbar;
