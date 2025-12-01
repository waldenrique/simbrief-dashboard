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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <span className="text-3xl">🗺️</span> Mapa Interativo com Animação
        </h2>
        {coords.length > 0 && (
          <div className="text-sm text-slate-400 font-mono">
            Progresso: {step}/{coords.length} waypoints
          </div>
        )}
      </div>

      {coords.length > 0 ? (
        <div className="glass-card p-0 overflow-hidden">
          <div className="h-[600px] w-full relative z-0">
            <MapContainer
              center={coords[0]}
              zoom={6}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Polyline positions={coords} color="#0ea5e9" weight={3} opacity={0.8} />
              {planePos && <Marker position={planePos} icon={airplaneIcon} />}
            </MapContainer>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 glass-panel rounded-xl">
          <div className="text-slate-500 text-center">
            <p className="text-lg mb-2">Nenhum plano de voo disponível</p>
            <p className="text-sm">Configure um ID SimBrief válido na barra lateral</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightMap;
