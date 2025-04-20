import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { MapContainer, TileLayer } from 'react-leaflet';

const AtcOnline = () => {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [planes, setPlanes] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      setConnectionStatus('Conectado ✅');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, event.data]);

      if (data.type === 'position') {
        setPlanes(prevPlanes => {
          const existingPlane = prevPlanes.find(plane => plane.callsign === data.callsign);
          if (existingPlane) {
            return prevPlanes.map(plane =>
              plane.callsign === data.callsign ? data : plane
            );
          } else {
            return [...prevPlanes, data];
          }
        });
        setSelectedPlane(data); // Atualiza painel com último avião
      }
    };

    socket.onclose = () => {
      setConnectionStatus('Desconectado ❌');
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4">🛩️ ATC Online - Rede 3D Rocket (Beta)</h1>

        <Card className="p-4 mb-4">
          <p>Status da conexão: <strong>{connectionStatus}</strong></p>
        </Card>

        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">🌍 Mapa de Tráfego</h2>
          <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {/* Marcadores removidos temporariamente */}
          </MapContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">📡 Mensagens Recebidas</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.length === 0 && <p>Nenhuma mensagem ainda.</p>}
            {messages.map((msg, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                {msg}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="p-4 sticky top-6">
          <h2 className="text-xl font-semibold mb-2">📋 Dados do Voo</h2>
          {selectedPlane ? (
            <ul className="space-y-1">
              <li><strong>Callsign:</strong> {selectedPlane.callsign}</li>
              <li><strong>Latitude:</strong> {selectedPlane.lat?.toFixed(6)}</li>
              <li><strong>Longitude:</strong> {selectedPlane.lon?.toFixed(6)}</li>
              <li><strong>Altitude:</strong> {selectedPlane.altitude} ft</li>
              <li><strong>Velocidade:</strong> {selectedPlane.speed} kt</li>
              <li><strong>Heading:</strong> {selectedPlane.heading}°</li>
              <li><strong>Vertical Speed:</strong> {selectedPlane.verticalSpeed || 0} ft/min</li>
            </ul>
          ) : (
            <p>Nenhum avião selecionado.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AtcOnline;
