import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSimbrief } from '../context/SimbriefContext';
import { FaPlane, FaMapMarkedAlt, FaBroadcastTower, FaTachometerAlt, FaHistory, FaSatelliteDish } from 'react-icons/fa';

const Sidebar = () => {
  const { userId, updateUserId, error } = useSimbrief();
  const [inputId, setInputId] = useState('');
  const location = useLocation();

  useEffect(() => {
    setInputId(userId);
  }, [userId]);

  const handleSubmit = () => {
    updateUserId(inputId);
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <li>
      <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(to)
          ? 'bg-aviation-600/20 text-aviation-400 border-r-2 border-aviation-500'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
          }`}
      >
        <Icon className={`text-lg ${isActive(to) ? 'text-aviation-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );

  return (
    <aside className="w-72 glass-panel h-screen flex flex-col border-r border-slate-800/50 sticky top-0 z-50">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-aviation-500 to-aviation-700 rounded-xl flex items-center justify-center shadow-lg shadow-aviation-500/20">
            <FaPlane className="text-white text-xl transform -rotate-45" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">SimBrief Dash</h1>
            <p className="text-xs text-slate-400 font-mono">v1.0.0 BETA</p>
          </div>
        </div>

        <div className="mb-8 bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">SimBrief ID</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="123456"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-aviation-500 focus:border-aviation-500 outline-none transition-all"
            />
            <button
              onClick={handleSubmit}
              className="p-2 bg-aviation-600 hover:bg-aviation-500 text-white rounded-lg transition-colors shadow-lg shadow-aviation-900/20"
            >
              <FaPlane className="text-sm" />
            </button>
          </div>
          {error && (
            <p className="text-red-400 mt-2 text-xs flex items-center">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
              {error}
            </p>
          )}
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            <NavItem to="/" icon={FaTachometerAlt} label="Dashboard" />
            <NavItem to="/atc-online" icon={FaBroadcastTower} label="ATC Online" />
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-slate-400">Sistema Operacional</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

