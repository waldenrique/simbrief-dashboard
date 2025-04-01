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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🗂️ Histórico de Voos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Data/Hora</th>
              <th className="px-4 py-2">Número do Voo</th>
              <th className="px-4 py-2">Origem</th>
              <th className="px-4 py-2">Destino</th>
            </tr>
          </thead>
          <tbody>
            {flights.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Nenhum voo salvo.</td>
              </tr>
            ) : (
              flights.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-2">{f.datetime}</td>
                  <td className="px-4 py-2">{f.flight_number}</td>
                  <td className="px-4 py-2">{f.origin.icao} – {f.origin.city}</td>
                  <td className="px-4 py-2">{f.destination.icao} – {f.destination.city}</td>
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
