import React, { useEffect, useState } from 'react';
import { getLatestFlightPlan } from '../services/simbriefService';
import FlightCard from '../components/FlightCard';
import CommsTable from '../components/CommsTable';
import { useSimbrief } from '../context/SimbriefContext';
import { FaPlane } from 'react-icons/fa';

const Dashboard = () => {
  const [flight, setFlight] = useState(null);
  const { userId } = useSimbrief();

  useEffect(() => {
    getLatestFlightPlan(userId).then((data) => {
      if (data) setFlight(data);
    });
  }, [userId]);

  return (
    <div className="space-y-8">
      {flight ? (
        <>
          <FlightCard flight={flight} />
          <CommsTable simbriefData={flight} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 glass-panel rounded-xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-aviation-900/50 border-t-aviation-500 rounded-full animate-spin"></div>
            <FaPlane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-aviation-500 text-xl" />
          </div>
          <p className="mt-4 text-slate-400 font-medium animate-pulse">Carregando plano de voo...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
