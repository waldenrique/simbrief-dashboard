import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSimbrief } from '../context/SimbriefContext';
import { FaPlane } from 'react-icons/fa';

const Sidebar = () => {
  const { userId, updateUserId, error } = useSimbrief();
  const [inputId, setInputId] = useState('');

  useEffect(() => {
    setInputId(userId);
  }, [userId]);

  const handleSubmit = () => {
    updateUserId(inputId);
  };

  return (
    <aside className="w-64 bg-gray-800 h-screen p-4 text-white flex flex-col justify-between">
      <div>
        <div className="mb-4">
          <label className="block text-sm mb-1">ID SimBrief</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="Digite o ID"
              className="w-full p-1 text-black rounded"
            />
            <button onClick={handleSubmit} className="p-2 bg-blue-500 rounded hover:bg-blue-600">
              <FaPlane />
            </button>
          </div>
          {error && (
            <p className="text-red-400 mt-1 text-sm">{error}</p>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-6">Simbrief Dash</h1>
        <nav className="space-y-4">
          <li><Link to="/" className="hover:text-blue-400">Dashboard</Link></li>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

