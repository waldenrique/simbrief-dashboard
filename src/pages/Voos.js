import React, { useEffect, useState } from 'react';
import { getFlightHistory } from '../utils/history';
import { Link } from 'react-router-dom';

const Voos = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const history = getFlightHistory();
    setFlights(history);
  }, []);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <span className="text-3xl">🗂️</span> Histórico de Voos
        </h2>
        <span className="text-sm text-slate-400 font-mono">{flights.length} voos registrados</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Data/Hora</th>
              <th className="px-6 py-4">Voo</th>
              <th className="px-6 py-4">Origem</th>
              <th className="px-6 py-4">Destino</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {flights.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-slate-500">
                  Nenhum voo salvo no histórico.
                </td>
              </tr>
            ) : (
              flights.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-slate-300 font-mono text-sm group-hover:text-aviation-300 transition-colors">
                    {f.datetime}
                  </td>
                  <td className="px-6 py-4 text-slate-100 font-bold">
                    {f.flight_number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-emerald-400 font-bold font-mono">{f.origin.icao}</span>
                      <span className="text-xs text-slate-500">{f.origin.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-amber-400 font-bold font-mono">{f.destination.icao}</span>
                      <span className="text-xs text-slate-500">{f.destination.city}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Voos;
