import { WebSocketServer } from 'ws';

export function createStatusBus({ port }) {
  const wss = new WebSocketServer({ port });
  const clients = new Set();
  const commandHandlers = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(String(raw));
        if (data?.type === 'command' && typeof data.command === 'string') {
          commandHandlers.forEach((handler) => handler(data.command, data?.meta));
        }
      } catch {
      }
    });
  });

  function broadcast(payload) {
    const message = JSON.stringify(payload);
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        try {
          client.send(message);
        } catch {
        }
      }
    });
  }

  function onCommand(handler) {
    commandHandlers.add(handler);
    return () => commandHandlers.delete(handler);
  }

  return { broadcast, onCommand, wss };
}
