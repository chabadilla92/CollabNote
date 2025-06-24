import { useEffect, useRef } from 'react';

type WebSocketMessage = {
  type: 'update'; // you can extend this union as needed
  content: string;
  docId: string;
};

export function useWebSocket(docId: string, onMessage: (data: WebSocketMessage) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3001');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = async (event) => {
      let messageData;

      if (typeof event.data === 'string') {
        messageData = JSON.parse(event.data);
      } else if (event.data instanceof Blob) {
        const text = await event.data.text();
        messageData = JSON.parse(text);
      } else {
        console.warn('Unexpected message data type:', typeof event.data);
        return;
      }

      if (messageData.docId === docId) {
        onMessage(messageData);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, [docId, onMessage]);

  const send = (data: Omit<WebSocketMessage, 'docId'>) => {
    socketRef.current?.send(JSON.stringify({ docId, ...data }));
  };

  return { send };
}
