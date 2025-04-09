let socket;

export const connectWebSocket = (onMessage) => {
  socket = new WebSocket('ws://localhost:8080');

  socket.onopen = () => {
    console.log('✅ WebSocket conectado ao servidor!');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};
