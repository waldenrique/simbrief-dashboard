const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('🛰️ Novo piloto conectado!');

  socket.on('message', (message) => {
    const data = JSON.parse(message);
    // Broadcast para todos os clientes conectados
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

console.log('🛰️ Servidor WebSocket rodando na porta 8080');
