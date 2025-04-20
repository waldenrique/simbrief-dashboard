// src/hooks/useFSUIPC.js
import { useEffect, useState } from 'react';

export function useFSUIPC() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('desconectado');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:2048/fsuipc/');

    socket.onopen = () => {
      setStatus('conectado');

      socket.send(JSON.stringify({
        command: 'subscribe',
        arguments: [
          'A:PLANE LATITUDE',
          'A:PLANE LONGITUDE',
          'A:PLANE ALTITUDE',
          'A:AIRSPEED INDICATED',
          'A:HEADING INDICATOR'
        ]
      }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.data) {
        const mapped = {};
        msg.data.forEach(item => {
          mapped[item.name] = item.value;
        });
        setData(mapped);
      }
    };

    socket.onclose = () => setStatus('desconectado');
    socket.onerror = () => setStatus('erro');

    return () => socket.close();
  }, []);

  return { data, status };
}
