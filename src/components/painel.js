import React from 'react';
import { useFSUIPC } from '../hooks/useFSUIPC';

function Painel() {
  const { data, status } = useFSUIPC();

  return (
    <div>
      <h1>Status da conexão: {status}</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Esperando dados...</p>
      )}
    </div>
  );
}

export default Painel;
