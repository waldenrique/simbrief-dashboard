import React from 'react';
import { useFSUIPC } from '../hooks/useFSUIPC';
import { ConnectionStatus } from './ConnectionStatus';

function Painel() {
  const { data, status, error, connectionAttempts } = useFSUIPC();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Painel FSUIPC</h1>
      
      <ConnectionStatus 
        status={status} 
        error={error} 
        connectionAttempts={connectionAttempts}
      />

      {status === 'conectado' && data ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">✈️ Dados em Tempo Real</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Latitude</p>
              <p className="text-2xl font-bold">{data.latitude?.toFixed(4) || '—'}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Longitude</p>
              <p className="text-2xl font-bold">{data.longitude?.toFixed(4) || '—'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Altitude (ft)</p>
              <p className="text-2xl font-bold">{Math.round(data.altitude || 0)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Velocidade (knots)</p>
              <p className="text-2xl font-bold">{Math.round(data.speed || 0)}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-sm text-gray-600">Rumo (graus)</p>
              <p className="text-2xl font-bold">{Math.round(data.heading || 0)}</p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">JSON Raw:</p>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            {status === 'conectando' ? '⏳ Aguardando conexão...' : '🔴 Desconectado. Aguarde reconnexão...'}
          </p>
        </div>
      )}
    </div>
  );
}

export default Painel;
