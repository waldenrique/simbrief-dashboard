// proxy-fsuipc.js
// Servidor proxy local que faz bridge entre a aplicação web e FSUIPC
const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();
const port = 3001;

// Armazenar conexões de clientes
const clients = new Map();

// Criar servidor HTTP
const server = http.createServer(app);

// Criar servidor WebSocket
const wss = new WebSocket.Server({ server });

// Conexão com FSUIPC (será aberta quando um cliente se conectar)
let fsuipcConnection = null;

// Reconectar ao FSUIPC a cada 5 segundos se desconectar
let reconnectInterval = null;

function connectToFSUIPC() {
  console.log('[PROXY] Tentando conectar ao FSUIPC em ws://localhost:2048/fsuipc/...');
  
  try {
    fsuipcConnection = new WebSocket('ws://localhost:2048/fsuipc/');
    
    fsuipcConnection.on('open', () => {
      console.log('[PROXY] ✅ Conectado ao FSUIPC!');
      
      // Notificar todos os clientes que estamos conectados
      clients.forEach((clientSocket, clientId) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            type: 'proxy-status',
            status: 'fsuipc-connected'
          }));
        }
      });
    });
    
    fsuipcConnection.on('message', (data) => {
      // Repassar mensagens do FSUIPC para todos os clientes conectados
      clients.forEach((clientSocket, clientId) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(data);
        }
      });
    });
    
    fsuipcConnection.on('close', () => {
      console.log('[PROXY] ❌ Desconectado do FSUIPC. Tentando reconectar...');
      
      // Notificar clientes
      clients.forEach((clientSocket, clientId) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            type: 'proxy-status',
            status: 'fsuipc-disconnected'
          }));
        }
      });
      
      // Tentar reconectar após 5 segundos
      setTimeout(connectToFSUIPC, 5000);
    });
    
    fsuipcConnection.on('error', (error) => {
      console.error('[PROXY] Erro FSUIPC:', error.message);
    });
  } catch (error) {
    console.error('[PROXY] Erro ao conectar:', error.message);
    setTimeout(connectToFSUIPC, 5000);
  }
}

// WebSocket server para clientes
wss.on('connection', (clientSocket, req) => {
  const clientId = Date.now() + Math.random();
  console.log(`[PROXY] 🔗 Cliente conectado: ${clientId}`);
  
  clients.set(clientId, clientSocket);
  
  // Conectar ao FSUIPC se ainda não estiver conectado
  if (!fsuipcConnection || fsuipcConnection.readyState !== WebSocket.OPEN) {
    connectToFSUIPC();
  } else {
    // Notificar cliente que já estamos conectados ao FSUIPC
    clientSocket.send(JSON.stringify({
      type: 'proxy-status',
      status: 'fsuipc-connected'
    }));
  }
  
  clientSocket.on('message', (data) => {
    // Repassar mensagens dos clientes para o FSUIPC
    if (fsuipcConnection && fsuipcConnection.readyState === WebSocket.OPEN) {
      fsuipcConnection.send(data);
    } else {
      clientSocket.send(JSON.stringify({
        type: 'error',
        message: 'FSUIPC não está conectado'
      }));
    }
  });
  
  clientSocket.on('close', () => {
    console.log(`[PROXY] 🔌 Cliente desconectado: ${clientId}`);
    clients.delete(clientId);
    
    // Se não há mais clientes, desconectar do FSUIPC também
    if (clients.size === 0 && fsuipcConnection) {
      console.log('[PROXY] Nenhum cliente conectado. Desconectando do FSUIPC...');
      fsuipcConnection.close();
      fsuipcConnection = null;
    }
  });
  
  clientSocket.on('error', (error) => {
    console.error(`[PROXY] Erro cliente ${clientId}:`, error.message);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    fsuipc: fsuipcConnection && fsuipcConnection.readyState === WebSocket.OPEN ? 'connected' : 'disconnected',
    clients: clients.size
  });
});

server.listen(port, 'localhost', () => {
  console.log(`\n[PROXY] 🚀 Servidor proxy iniciado em ws://localhost:${port}`);
  console.log(`[PROXY] 📊 Health check: http://localhost:${port}/health\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[PROXY] ⏹️  Encerrando servidor...');
  if (fsuipcConnection) {
    fsuipcConnection.close();
  }
  wss.close();
  server.close(() => {
    console.log('[PROXY] ✅ Servidor encerrado');
    process.exit(0);
  });
});
