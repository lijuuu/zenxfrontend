
import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { toast } from 'sonner';
import { Challenge, LeaderboardEntry } from '@/api/challengeTypes';

interface ChallengeWSMessage {
  event: string;
  payload: any;
}

interface ChallengeWSState {
  connected: boolean;
  challenge: Challenge | null;
  leaderboard: LeaderboardEntry[];
  lastEvent: string | null;
  error: string | null;
}

export const useChallengeWebSocket = (challengeId: string | undefined, userId: string | undefined) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [state, setState] = useState<ChallengeWSState>({
    connected: false,
    challenge: null,
    leaderboard: [],
    lastEvent: null,
    error: null
  });
  const dispatch = useAppDispatch();

  const connectWebSocket = useCallback(() => {
    if (!challengeId || !userId) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:7000'}/ws/challenges/${challengeId}?user_id=${userId}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Challenge WebSocket connected');
      setState(prev => ({ ...prev, connected: true }));
      // Send connect event
      socket.send(JSON.stringify({ event: 'connect', payload: { user_id: userId } }));
    };

    socket.onmessage = (event) => {
      try {
        const message: ChallengeWSMessage = JSON.parse(event.data);
        console.log('Challenge WS message received:', message);

        switch (message.event) {
          case 'connect':
          case 'reconnect':
            if (message.payload?.status) {
              toast.success(message.payload.message || 'Connected to challenge');
            } else {
              toast.error(message.payload?.message || 'Failed to connect to challenge');
            }
            break;

          case 'hydrate':
            setState(prev => ({ 
              ...prev, 
              challenge: message.payload?.challenge || null,
              leaderboard: message.payload?.leaderboard || [],
              lastEvent: message.event
            }));
            break;

          case 'userforfeited':
            toast.info(`${message.payload.user_id === userId ? 'You' : 'A participant'} forfeited the challenge`);
            // Re-hydrate after user forfeits
            socket.send(JSON.stringify({ event: 'hydrate', payload: { user_id: userId } }));
            setState(prev => ({ ...prev, lastEvent: message.event }));
            break;

          case 'usersubmit':
            toast.info(`${message.payload.user_id === userId ? 'Your' : 'A participant\'s'} code is being evaluated`);
            setState(prev => ({ ...prev, lastEvent: message.event }));
            break;

          case 'usercodesuccess':
            toast.success(`${message.payload.user_id === userId ? 'Your' : 'A participant\'s'} solution passed!`);
            setState(prev => ({ ...prev, lastEvent: message.event }));
            break;

          case 'usercodefail':
            if (message.payload.user_id === userId) {
              toast.error('Your solution failed');
            }
            setState(prev => ({ ...prev, lastEvent: message.event }));
            break;

          case 'userwon':
            if (message.payload.user_id === userId) {
              toast.success('Congratulations! You won the challenge!');
            } else {
              toast.info(`${message.payload.user_name || 'A participant'} won the challenge`);
            }
            setState(prev => ({ ...prev, lastEvent: message.event }));
            break;

          case 'timeexhausted':
            toast.warning('Time is up! The challenge has ended');
            setState(prev => ({ ...prev, lastEvent: message.event }));
            break;

          default:
            console.log('Unhandled challenge event:', message.event);
        }
      } catch (error) {
        console.error('Error processing challenge WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('Challenge WebSocket error:', error);
      setState(prev => ({ ...prev, error: 'Connection error' }));
      toast.error('Challenge connection error');
    };

    socket.onclose = () => {
      console.log('Challenge WebSocket closed');
      setState(prev => ({ ...prev, connected: false }));
      
      // Auto-reconnect after a delay
      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          connectWebSocket();
        }
      }, 3000);
    };

    setWs(socket);
    
    return () => {
      socket.close();
    };
  }, [challengeId, userId]);

  // Connect when component mounts or challengeId/userId changes
  useEffect(() => {
    connectWebSocket();
    
    // Visibility change handler for reconnecting
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !state.connected) {
        connectWebSocket();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ws?.close();
    };
  }, [connectWebSocket, state.connected]);

  // Send challenge actions
  const sendAction = useCallback((event: string, payload: any = {}) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error('Not connected to challenge');
      return;
    }

    console.log('Sending challenge action:', event, payload);
    ws.send(JSON.stringify({
      event,
      payload: { ...payload, user_id: userId }
    }));
  }, [ws, userId]);

  const startChallenge = useCallback(() => {
    sendAction('startchallenge');
  }, [sendAction]);

  const forfeitChallenge = useCallback(() => {
    sendAction('forfeitchallenge');
  }, [sendAction]);

  const submitCode = useCallback((code: string, language: string, problemId: string) => {
    sendAction('usersubmit', { code, language, problem_id: problemId });
  }, [sendAction]);

  const reconnect = useCallback(() => {
    sendAction('reconnect');
  }, [sendAction]);

  const hydrate = useCallback(() => {
    sendAction('hydrate');
  }, [sendAction]);

  return {
    state,
    startChallenge,
    forfeitChallenge,
    submitCode,
    reconnect,
    hydrate,
    connected: state.connected
  };
};
