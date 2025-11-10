import React from 'react';

export const ConnectionStatus = ({ status, error, connectionAttempts }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'conectado':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'conectando':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'erro':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'desconectado':
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'conectado':
        return '✅';
      case 'conectando':
        return '⏳';
      case 'erro':
        return '❌';
      case 'desconectado':
      default:
        return '🔴';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'conectado':
        return 'Conectado ao FSUIPC';
      case 'conectando':
        return `Conectando ao FSUIPC... (Tentativa ${connectionAttempts + 1})`;
      case 'erro':
        return `Erro ao conectar: ${error || 'Desconhecido'}`;
      case 'desconectado':
      default:
        return 'Desconectado do FSUIPC';
    }
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${getStatusColor()}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{getStatusIcon()}</span>
        <span className="font-semibold">{getStatusMessage()}</span>
      </div>
      {error && status === 'erro' && (
        <div className="mt-2 text-sm">
          <p className="font-mono">{error}</p>
          <p className="mt-1 text-xs">
            💡 Dica: Certifique-se de que Flight Simulator está aberto e FSUIPC está rodando
          </p>
        </div>
      )}
      {status === 'conectando' && connectionAttempts > 0 && (
        <div className="mt-2 text-sm">
          <p>Aguardando reconexão automática...</p>
          <p className="text-xs mt-1">
            Próxima tentativa em 5 segundos
          </p>
        </div>
      )}
    </div>
  );
};
