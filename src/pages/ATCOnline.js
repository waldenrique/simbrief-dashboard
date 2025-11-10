import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { MapContainer, TileLayer } from 'react-leaflet';

const AtcOnline = () => {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [planes, setPlanes] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let socket = null;
    let reconnectTimeout = null;

    const connectToFSUIPC = () => {
      try {
        console.log('[ATCOnline] Conectando a ws://localhost:2048/fsuipc/');
        setConnectionStatus('Conectando...');
        
        socket = new WebSocket('ws://localhost:2048/fsuipc/');

        socket.onopen = () => {
          console.log('[ATCOnline] ✅ Conectado ao FSUIPC');
          setConnectionStatus('Conectado ✅');
          setRetryCount(0);

          // Declarar variáveis FSUIPC
          socket.send(JSON.stringify({
            command: 'vars.declare',
            definitions: [
              { name: 'latitude', type: 'f64', varname: 'PLANE LATITUDE' },
              { name: 'longitude', type: 'f64', varname: 'PLANE LONGITUDE' },
              { name: 'altitude', type: 'f64', varname: 'PLANE ALTITUDE' },
              { name: 'speed', type: 'i32', varname: 'AIRSPEED INDICATED' },
              { name: 'heading', type: 'i32', varname: 'HEADING INDICATOR' }
            ]
          }));

          // Iniciar leitura contínua
          setTimeout(() => {
            socket.send(JSON.stringify({
              command: 'vars.read'
            }));
          }, 100);
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);

            // Resposta de vars.read com dados
            if (msg.data && Array.isArray(msg.data)) {
              const mapped = {};
              msg.data.forEach(item => {
                mapped[item.name] = item.value;
              });

              setMessages(prev => [...prev, event.data]);

              const flightData = {
                type: 'position',
                callsign: 'PLAYER',
                lat: mapped.latitude || 0,
                lon: mapped.longitude || 0,
                altitude: mapped.altitude || 0,
                speed: mapped.speed || 0,
                heading: mapped.heading || 0
              };

              setPlanes([flightData]);
              setSelectedPlane(flightData);

              // Continuar lendo
              socket.send(JSON.stringify({
                command: 'vars.read'
              }));
            }
            // Resposta de vars.declare
            else if (msg.command === 'vars.declare') {
              console.log('[ATCOnline] Variáveis declaradas');
            }
          } catch (error) {
            console.error('[ATCOnline] Erro ao processar mensagem:', error);
          }
        };

        socket.onclose = () => {
          console.log('[ATCOnline] Desconectado do FSUIPC');
          setConnectionStatus('Desconectado ❌');
          
          // Reconectar após 5 segundos
          reconnectTimeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            connectToFSUIPC();
          }, 5000);
        };

        socket.onerror = (error) => {
          console.error('[ATCOnline] Erro WebSocket:', error);
          setConnectionStatus('Erro ao conectar ❌');
        };

      } catch (error) {
        console.error('[ATCOnline] Erro ao criar WebSocket:', error);
        setConnectionStatus('Erro ao criar conexão ❌');
      }
    };

    connectToFSUIPC();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
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
