import React, { useEffect, useState } from 'react';
import { getLatestFlightPlan } from '../services/simbriefService';
import FlightCard from '../components/FlightCard';
import CommsTable from '../components/CommsTable';
import { useSimbrief } from '../context/SimbriefContext';


const Dashboard = () => {
  const [flight, setFlight] = useState(null);
  const { userId } = useSimbrief();

  useEffect(() => {
    getLatestFlightPlan(userId).then((data) => {
      if (data) setFlight(data);
    });
  }, [userId]);

  return (
    <div className="p-6 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      {flight ? (
        <>
          <FlightCard flight={flight} />
          <CommsTable simbriefData={flight} />
        </>
      ) : (
        <p>Carregando plano de voo...</p>
      )}
    </div>
  );
};

export default Dashboard;
