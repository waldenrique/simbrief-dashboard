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
        console.log('[ATCOnline] Conectando a wss://localhost:2048/fsuipc/');
        setConnectionStatus('Conectando...');

        socket = new WebSocket('wss://localhost:2048/fsuipc/');

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3">
        <div className="glass-card p-6 border-l-4 border-amber-500">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🚧</div>
            <div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">Funcionalidade em Desenvolvimento</h3>
              <p className="text-slate-300 mb-2">
                Esta página está sendo desenvolvida e em breve terá as seguintes funcionalidades:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 ml-4">
                <li>Integração com <strong className="text-aviation-400">NewSky</strong> para dados de voo em tempo real</li>
                <li>Sistema de <strong className="text-aviation-400">ATC com IA</strong> para controle de tráfego aéreo</li>
                <li>Mapa de tráfego ao vivo com aeronaves da rede</li>
                <li>Comunicação automática entre piloto e ATC</li>
              </ul>
              <p className="text-slate-500 text-sm mt-3">
                Aguarde as próximas atualizações! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-3xl">🛩️</span> ATC Online <span className="text-xs bg-aviation-500/20 text-aviation-300 px-2 py-1 rounded-full border border-aviation-500/30">BETA</span>
          </h1>
          <div className={`px-4 py-2 rounded-lg font-mono text-sm font-bold flex items-center gap-2 ${connectionStatus.includes('Conectado ✅')
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
            <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('Conectado ✅') ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            {connectionStatus}
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-0">
          <div className="p-4 border-b border-slate-800/50 bg-slate-900/30 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-100">🌍 Mapa de Tráfego</h2>
            <span className="text-xs text-slate-400">Live Data</span>
          </div>
          <div className="h-[500px] w-full relative z-0">
            <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {/* Marcadores removidos temporariamente */}
            </MapContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
            <span className="text-xl">📡</span> Mensagens Recebidas
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
            {messages.length === 0 && <p className="text-slate-500 text-center py-8">Nenhuma mensagem recebida ainda.</p>}
            {messages.map((msg, index) => (
              <div key={index} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 font-mono text-xs text-slate-300 hover:bg-slate-800/50 transition-colors">
                {msg}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="sticky top-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-100 border-b border-slate-800/50 pb-2">
            📋 Dados do Voo
          </h2>
          {selectedPlane ? (
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Callsign</span>
                <span className="font-mono font-bold text-aviation-400">{selectedPlane.callsign}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Latitude</span>
                <span className="font-mono text-slate-200">{selectedPlane.lat?.toFixed(6)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Longitude</span>
                <span className="font-mono text-slate-200">{selectedPlane.lon?.toFixed(6)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Altitude</span>
                <span className="font-mono text-emerald-400">{selectedPlane.altitude} ft</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Velocidade</span>
                <span className="font-mono text-amber-400">{selectedPlane.speed} kt</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Heading</span>
                <span className="font-mono text-slate-200">{selectedPlane.heading}°</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">V. Speed</span>
                <span className="font-mono text-slate-200">{selectedPlane.verticalSpeed || 0} ft/min</span>
              </li>
            </ul>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>Nenhum avião selecionado.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AtcOnline;
