import React from 'react';
import { FaPlane, FaMapMarkerAlt, FaRoute, FaClock, FaPlaneDeparture, FaPlaneArrival, FaWind, FaMountain } from 'react-icons/fa';

const FlightCard = ({ flight }) => {
  const origem = flight.origin;
  const destino = flight.destination;
  const geral = flight.general;
  const aeronave = flight.aircraft;
  const alternativo = flight.alternate;
  const torre = flight.atc;
  const tempo = flight.times;

  const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
      <div className="mt-1">
        <Icon className="text-aviation-400 text-lg" />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-slate-100 font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Flight Info */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FaPlane className="text-9xl text-white transform -rotate-45" />
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <FaPlane className="text-aviation-500" />
            Informações do Voo
          </h2>
          <span className="px-3 py-1 bg-aviation-500/20 text-aviation-300 rounded-full text-sm font-mono border border-aviation-500/30">
            {torre.callsign}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <InfoItem label="Aeronave" value={aeronave.icaocode} icon={FaPlane} />
          <InfoItem label="Cost Index" value={geral.costindex} icon={FaWind} />
          <InfoItem label="Cruzeiro" value={`FL${geral.initial_altitude}`} icon={FaMountain} />
          <InfoItem label="Tempo Est." value={`${Math.floor(tempo.est_time_enroute / 60)}h ${tempo.est_time_enroute % 60}m`} icon={FaClock} />
          <div className="col-span-full">
            <InfoItem label="Rota" value={geral.route} icon={FaRoute} />
          </div>
          <InfoItem label="Alternativo" value={`${alternativo.name} (${alternativo.icao_code})`} icon={FaMapMarkerAlt} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
            <FaPlaneDeparture /> Origem
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
              <div>
                <p className="text-3xl font-bold text-slate-100">{origem.icao_code}</p>
                <p className="text-sm text-slate-400">{origem.name}</p>
              </div>
              <p className="text-xl font-mono text-emerald-400">{origem.plan_rwy}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="IATA" value={origem.iata_code} icon={FaMapMarkerAlt} />
              <InfoItem label="Elevação" value={`${origem.elevation} ft`} icon={FaMountain} />
              <InfoItem label="Transição" value={origem.trans_alt} icon={FaRoute} />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">METAR</p>
              <p className="font-mono text-xs text-slate-300 leading-relaxed">{origem.metar}</p>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            <FaPlaneArrival /> Destino
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
              <div>
                <p className="text-3xl font-bold text-slate-100">{destino.icao_code}</p>
                <p className="text-sm text-slate-400">{destino.name}</p>
              </div>
              <p className="text-xl font-mono text-amber-400">{destino.plan_rwy}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="IATA" value={destino.iata_code} icon={FaMapMarkerAlt} />
              <InfoItem label="Elevação" value={`${destino.elevation} ft`} icon={FaMountain} />
              <InfoItem label="Transição" value={destino.trans_alt} icon={FaRoute} />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">METAR</p>
              <p className="font-mono text-xs text-slate-300 leading-relaxed">{destino.metar}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
