import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Icon } from 'leaflet';

const airplaneIcon = new Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/228BE6/airplane-take-off.png',
  iconSize: [32, 32],
});

const LiveFlight = () => {
  const [flightData, setFlightData] = useState(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch("http://localhost:32123/json");
        const data = await res.json();
        setFlightData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do SimBridge:", error);
        setFlightData(null);
      }
    };

    const interval = setInterval(fetchLiveData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🛩️ Voo em Tempo Real (SimBridge)</h2>

      {!flightData ? (
        <p className="text-red-400">⚠️ Sem conexão com o SimToolkitPro. Inicie o simulador e o SimToolkit.</p>
      ) : (
        <>
          <MapContainer
            center={[flightData.position.latitude, flightData.position.longitude]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[flightData.position.latitude, flightData.position.longitude]}
              icon={airplaneIcon}
            >
              <Tooltip direction="top">
                🛫 {flightData.simbrief?.flight_number || 'N/A'}<br />
                ✈️ {flightData.simbrief?.departure} → {flightData.simbrief?.arrival}
              </Tooltip>
            </Marker>
          </MapContainer>

          <div className="mt-4 bg-gray-100 p-4 rounded shadow">
            <p><strong>Altitude:</strong> {flightData.position.altitude.toFixed(0)} ft</p>
            <p><strong>Heading:</strong> {flightData.position.heading.toFixed(0)}°</p>
            <p><strong>Latitude:</strong> {flightData.position.latitude}</p>
            <p><strong>Longitude:</strong> {flightData.position.longitude}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveFlight;
