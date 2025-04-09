
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Ícone do avião
const planeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const AtcOnline = () => {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      setConnectionStatus('Conectado ✅');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, event.data]);

      // Se for posição de avião, atualiza
      if (data.type === 'position') {
        setPlanes(prevPlanes => {
          // Atualiza se o avião já existir, se não, adiciona novo
          const existingPlane = prevPlanes.find(plane => plane.callsign === data.callsign);
          if (existingPlane) {
            return prevPlanes.map(plane =>
              plane.callsign === data.callsign ? data : plane
            );
          } else {
            return [...prevPlanes, data];
          }
        });
      }
    };

    socket.onclose = () => {
      setConnectionStatus('Desconectado ❌');
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6">
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
          {planes.map((plane, index) => (
            <Marker
              key={index}
              position={[plane.lat, plane.lon]}
              icon={planeIcon}
            >
              <Popup>
                <strong>{plane.callsign}</strong><br />
                Altitude: {plane.altitude} ft<br />
                Velocidade: {plane.speed} kt<br />
                Heading: {plane.heading}°
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">📡 Mensagens Recebidas</h2>
        <div className="space-y-2">
          {messages.length === 0 && <p>Nenhuma mensagem ainda.</p>}
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              {msg}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AtcOnline;
