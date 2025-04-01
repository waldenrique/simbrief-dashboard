import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useSimbrief } from '../context/SimbriefContext';
import { getLatestFlightPlan } from '../services/simbriefService';

const airplaneIcon = new Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/airplane-take-off.png',
  iconSize: [32, 32],
});

const FlightMap = () => {
  const { userId } = useSimbrief();
  const [coords, setCoords] = useState([]);
  const [planePos, setPlanePos] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchFlight = async () => {
      const flight = await getLatestFlightPlan(userId);
      if (!flight?.navlog?.fix) return;

      const route = flight.navlog.fix
      .map((fix) => {
        const lat = parseFloat(fix.pos_lat?.[0]);
        const lon = parseFloat(fix.pos_long?.[0]);
        if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
        return null;
      })
      .filter(Boolean);
    

      setCoords(route);
      setPlanePos(route[0]);
      setStep(0);
    };

    if (userId) {
      fetchFlight();
    }
  }, [userId]);

  useEffect(() => {
    if (coords.length === 0) return;

    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= coords.length) return prev;
        setPlanePos(coords[next]);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [coords]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🗺️ Mapa Interativo com Animação</h2>

      {coords.length > 0 ? (
        <MapContainer
          center={coords[0]}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={coords} color="blue" />
          {planePos && <Marker position={planePos} icon={airplaneIcon} />}
        </MapContainer>
      ) : (
        <p className="text-gray-600">Nenhum plano de voo disponível ou rota vazia.</p>
      )}
    </div>
  );
};

export default FlightMap;
