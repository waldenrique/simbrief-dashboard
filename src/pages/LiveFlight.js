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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <span className="text-3xl">🛩️</span> Voo em Tempo Real
        </h2>
        <div className={`px-4 py-2 rounded-lg font-mono text-sm font-bold flex items-center gap-2 ${flightData
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
          <div className={`w-2 h-2 rounded-full ${flightData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          {flightData ? 'SimBridge Conectado' : 'Desconectado'}
        </div>
      </div>

      {!flightData ? (
        <div className="flex flex-col items-center justify-center h-96 glass-panel rounded-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-lg text-red-400 font-semibold mb-2">Sem conexão com o SimToolkitPro</p>
            <p className="text-sm text-slate-400">Inicie o simulador e o SimToolkit para visualizar dados em tempo real</p>
          </div>
        </div>
      ) : (
        <>
          <div className="glass-card p-0 overflow-hidden">
            <div className="h-[500px] w-full relative z-0">
              <MapContainer
                center={[flightData.position.latitude, flightData.position.longitude]}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <Marker
                  position={[flightData.position.latitude, flightData.position.longitude]}
                  icon={airplaneIcon}
                >
                  <Tooltip direction="top" permanent>
                    🛫 {flightData.simbrief?.flight_number || 'N/A'}<br />
                    ✈️ {flightData.simbrief?.departure} → {flightData.simbrief?.arrival}
                  </Tooltip>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-slate-100 border-b border-slate-800/50 pb-2">
              📊 Dados de Telemetria
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Altitude</p>
                <p className="text-2xl font-bold text-emerald-400 font-mono">{flightData.position.altitude.toFixed(0)}</p>
                <p className="text-xs text-slate-500">ft</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Heading</p>
                <p className="text-2xl font-bold text-aviation-400 font-mono">{flightData.position.heading.toFixed(0)}</p>
                <p className="text-xs text-slate-500">graus</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-lg font-bold text-slate-200 font-mono">{flightData.position.latitude.toFixed(6)}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-lg font-bold text-slate-200 font-mono">{flightData.position.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveFlight;
