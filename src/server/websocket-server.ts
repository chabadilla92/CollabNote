import { WebSocketServer } from 'ws';
import http from 'http';

const port = 3001;

const server = http.createServer();

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received: ${message}`);

    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, () => {
  console.log(`WebSocket server listening on ws://localhost:${port}`);
});
