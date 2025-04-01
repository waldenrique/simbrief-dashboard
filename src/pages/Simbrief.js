import React, { useEffect, useState } from 'react';
import { getLatestFlightPlan } from '../services/simbriefService';
import { FaPlane, FaPlaneDeparture, FaPlaneArrival, FaGasPump, FaUserFriends, FaMapMarkerAlt, FaWeightHanging, FaClock } from 'react-icons/fa';
import { useSimbrief } from '../context/SimbriefContext';

const Card = ({ title, icon, children }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <div className="flex items-center mb-4 text-indigo-600">
      <div className="text-2xl mr-2">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

const Simbrief = () => {
  const [flight, setFlight] = useState(null);

  const { userId } = useSimbrief();

  useEffect(() => {
    getLatestFlightPlan(userId).then((data) => {
      if (data) setFlight(data);
    });
  }, [userId]);
  
  if (!flight) return <p className="p-6">Carregando plano de voo...</p>;

  const {
    general = {},
    aircraft = {},
    fuel = {},
    origin = {},
    destination = {},
    alternate = {},
    weights = {},
    passengers = {},
    times = {},
  } = flight;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Plano de Voo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Voo" icon={<FaPlane />}>
          <p><strong>Número:</strong> {general.flight_number}</p>
          <p><strong>Tipo:</strong> {general.flight_type}</p>
          <p><strong>Cost Index:</strong> {general.costindex}</p>
          <p><strong>Cruzeiro:</strong> FL{general.initial_altitude}</p>
          <p><strong>Duração:</strong> {general.est_time_enroute}</p>
        </Card>

        <Card title="Aeronave" icon={<FaPlaneDeparture />}>
          <p><strong>Modelo:</strong> {aircraft.aircraft_name}</p>
          <p><strong>Registro:</strong> {aircraft.registration}</p>
          <p><strong>Operador:</strong> {aircraft.airline_name}</p>
        </Card>

        <Card title="Origem" icon={<FaMapMarkerAlt />}>
          <p><strong>{origin.name}</strong></p>
          <p><strong>ICAO:</strong> {origin.icao_code}</p>
          <p>{origin.city}, {origin.country_name}</p>
        </Card>

        <Card title="Destino" icon={<FaMapMarkerAlt />}>
          <p><strong>{destination.name}</strong></p>
          <p><strong>ICAO:</strong> {destination.icao_code}</p>
          <p>{destination.city}, {destination.country_name}</p>
        </Card>

        <Card title="Alternativo" icon={<FaPlaneArrival />}>
          <p><strong>{alternate.name}</strong></p>
          <p><strong>ICAO:</strong> {alternate.icao_code}</p>
        </Card>

        <Card title="Pesos" icon={<FaWeightHanging />}>
          <p><strong>Decolagem:</strong> {weights.est_tow} kg</p>
          <p><strong>Pouso:</strong> {weights.est_ldw} kg</p>
          <p><strong>ZFW:</strong> {weights.est_zfw} kg</p>
        </Card>

        <Card title="Pax & Carga" icon={<FaUserFriends />}>
          <p><strong>Passageiros:</strong> {passengers.count}</p>
          <p><strong>Carga:</strong> {weights.cargo} kg</p>
        </Card>

        <Card title="Combustível" icon={<FaGasPump />}>
          <p><strong>Ramp:</strong> {fuel.plan_ramp} kg</p>
          <p><strong>Taxi:</strong> {fuel.plan_taxifuel} kg</p>
          <p><strong>Trip:</strong> {fuel.plan_trip} kg</p>
          <p><strong>Reserva:</strong> {fuel.plan_final_reserve} kg</p>
        </Card>

        <Card title="Horários" icon={<FaClock />}>
          <p><strong>Partida:</strong> {times.departure_time}</p>
          <p><strong>Chegada:</strong> {times.arrival_time}</p>
        </Card>
      </div>
    </div>
  );
};

export default Simbrief;
