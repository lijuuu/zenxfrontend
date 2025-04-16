
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface WSEvent {
  event: string;
  room_id: string;
  timestamp: string;
  data: any;
}

export const useWebSocket = (roomId: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!roomId || !token) return;
    
    const connectWebSocket = () => {
      const socket = new WebSocket(`wss://localhost:7000/ws/rooms/${roomId}?token=${token}`);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        reconnectAttemptsRef.current = 0;
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WSEvent;
          setLastEvent(data);
          
          // Process events based on type
          switch (data.event) {
            case 'user_joined':
              toast.info(`${data.data.username} joined the room`);
              break;
            case 'challenge_started':
              toast.success('Challenge started!');
              break;
            case 'submission_update':
              if (data.data.status === 'accepted') {
                toast.success(`Problem solved by ${data.data.user_id}`);
              }
              break;
            case 'challenge_ended':
              toast.info('Challenge ended');
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket closed');
        setConnected(false);
        
        // Reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
          setTimeout(connectWebSocket, delay);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error', error);
      };
      
      setWs(socket);
    };
    
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId, token]);
  
  return { ws, connected, lastEvent };
};

export default useWebSocket;
