// src/hooks/useFSUIPC.js
import { useEffect, useState } from 'react';

export function useFSUIPC() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('desconectado');
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    let socket = null;
    let reconnectTimeout = null;

    const connectToFSUIPC = () => {
      try {
        // Usar WSS (seguro) para conectar ao FSUIPC com SSL ativado
        const wsUrl = 'wss://localhost:2048/fsuipc/';
        console.log('[FSUIPC] Tentando conectar a', wsUrl, '...');
        setStatus('conectando');
        
        // Para certificados auto-assinados (FSUIPC), permitir conexão insegura
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('[FSUIPC] ✅ Conectado com sucesso!');
          setStatus('conectado');
          setError(null);
          setConnectionAttempts(0);

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
            
            // Resposta de vars.read
            if (msg.data && Array.isArray(msg.data)) {
              const mapped = {};
              msg.data.forEach(item => {
                mapped[item.name] = item.value;
              });
              setData(mapped);
              
              // Continuar lendo
              socket.send(JSON.stringify({
                command: 'vars.read'
              }));
            }
            // Resposta de vars.declare
            else if (msg.command === 'vars.declare') {
              console.log('[FSUIPC] Variáveis declaradas com sucesso');
            }
          } catch (e) {
            console.error('[FSUIPC] Erro ao parsear mensagem:', e);
          }
        };

        socket.onclose = () => {
          console.log('[FSUIPC] Conexão fechada');
          setStatus('desconectado');
          setData(null);
          
          // Tentar reconectar após 5 segundos
          console.log('[FSUIPC] Tentando reconectar em 5 segundos...');
          reconnectTimeout = setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connectToFSUIPC();
          }, 5000);
        };

        socket.onerror = (error) => {
          console.error('[FSUIPC] Erro WebSocket:', error);
          setStatus('erro');
          setError('Não foi possível conectar ao FSUIPC. Verifique se Flight Simulator está rodando.');
        };

      } catch (error) {
        console.error('[FSUIPC] Erro ao criar WebSocket:', error);
        setStatus('erro');
        setError(error.message);
      }
    };

    connectToFSUIPC();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
  }, []);

  return { data, status, error, connectionAttempts };
}
