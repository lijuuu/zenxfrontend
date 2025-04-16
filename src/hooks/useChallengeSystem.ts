import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState, useEffect, useRef } from 'react'; 
import { ProblemMetadata } from '@/api/types';
import { useProblems } from './useProblems';

// API base URL
const API_BASE_URL = 'https://localhost:7000/api/v1';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Access denied', {
        description: 'You don\'t have permission to access this resource',
      });
    } else if (error.response?.status === 404) {
      toast.error('Resource not found', {
        description: 'The requested resource could not be found',
      });
    } else if (error.response?.status >= 500) {
      toast.error('Server error', {
        description: 'Something went wrong on the server. Please try again later.',
      });
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface Challenge {
  id: string;
  title: string;
  creatorId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPrivate: boolean;
  accessCode?: string;
  problemIds: string[];
  timeLimit: number;
  createdAt: string;
  isActive: boolean;
  participantIds: string[];
}

export interface Room {
  id: string;
  challengeId: string;
  password: string;
  status: 'waiting' | 'active' | 'completed';
  startTime?: string;
  endTime?: string;
  participantIds: string[];
  problemIds: string[];
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
}

export interface Submission {
  id: string;
  roomId: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  completedAt?: string;
  executionTime?: number;
  memory?: number;
  timeTaken?: number;
  score?: number;
}

export interface UserStats {
  userId: string;
  problemsCompleted: number;
  totalTimeTaken: number;
  challengesCompleted: number;
  score: number;
  roomStats: {
    [roomId: string]: {
      rank: number;
      problemsCompleted: number;
      totalScore: number;
    };
  };
}

export interface WSEvent {
  event: string;
  room_id: string;
  timestamp: string;
  data: any;
}

// Export the useProblems hook from the separate file
export { useProblems };

// Challenge hooks
export const usePublicChallenges = (options?: { 
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['challenges', 'public', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.difficulty) params.append('difficulty', options.difficulty);
      if (options?.isActive !== undefined) params.append('isActive', options.isActive.toString());
      if (options?.page) params.append('page', options.page.toString());
      if (options?.pageSize) params.append('pageSize', options.pageSize.toString());
      
      const response = await api.get(`/challenges/public?${params.toString()}`);
      return response.data.challenges as Challenge[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useChallenge = (challengeId: string) => {
  return useQuery({
    queryKey: ['challenges', challengeId],
    queryFn: async () => {
      const response = await api.get(`/challenges/${challengeId}`);
      return response.data as Challenge;
    },
    enabled: !!challengeId,
  });
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      creatorId: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      isPrivate: boolean;
      problemIds: string[];
      timeLimit: number;
    }) => {
      const response = await api.post('/challenges', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create challenge', {
        description: error.message || 'Please try again',
      });
    },
  });
};

export const useJoinChallenge = () => {
  return useMutation({
    mutationFn: async ({
      challengeId,
      userId,
      accessCode,
    }: {
      challengeId: string;
      userId: string;
      accessCode?: string;
    }) => {
      const response = await api.post(`/challenges/${challengeId}/join`, {
        userId,
        accessCode,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Joined challenge successfully', {
        description: `Room ID: ${data.roomId}`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to join challenge', {
        description: error.message || 'Please check the access code and try again',
      });
    },
  });
};

// Room hooks
export const useCreateRoom = () => {
  return useMutation({
    mutationFn: async ({
      challengeId,
      creatorId,
    }: {
      challengeId: string;
      creatorId: string;
    }) => {
      const response = await api.post('/rooms', {
        challengeId,
        creatorId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Room created successfully', {
        description: `Share the join URL: ${data.joinUrl}`,
      });
    },
  });
};

export const useJoinRoom = () => {
  return useMutation({
    mutationFn: async ({
      roomId,
      userId,
      password,
    }: {
      roomId: string;
      userId: string;
      password: string;
    }) => {
      const response = await api.post(`/rooms/${roomId}/join`, {
        userId,
        password,
      });
      return response.data as Room;
    },
    onSuccess: () => {
      toast.success('Joined room successfully');
    },
  });
};

export const useRoomStatus = (roomId: string) => {
  return useQuery({
    queryKey: ['rooms', roomId],
    queryFn: async () => {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data;
    },
    enabled: !!roomId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
};

export const useStartChallenge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      const response = await api.post(`/rooms/${roomId}/start`, {
        userId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.roomId] });
      toast.success('Challenge started!');
    },
  });
};

export const useEndChallenge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      const response = await api.post(`/rooms/${roomId}/end`, {
        userId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', variables.roomId] });
      toast.success('Challenge ended');
    },
  });
};

// Submissions hooks
export const useSubmitSolution = () => {
  return useMutation({
    mutationFn: async ({
      roomId,
      userId,
      problemId,
      code,
      language,
    }: {
      roomId: string;
      userId: string;
      problemId: string;
      code: string;
      language: string;
    }) => {
      const response = await api.post(`/rooms/${roomId}/submissions`, {
        userId,
        problemId,
        code,
        language,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Solution submitted', {
        description: 'Your solution is being evaluated',
      });
    },
  });
};

// Fix: Corrected access to the status property in useSubmission
export const useSubmission = (submissionId: string) => {
  return useQuery({
    queryKey: ['submissions', submissionId],
    queryFn: async () => {
      const response = await api.get(`/submissions/${submissionId}`);
      return response.data as Submission;
    },
    enabled: !!submissionId,
    refetchInterval: (data) => {
      // Fixed: Properly check the status from the submission data
      return data && data.status === 'pending' ? 2000 : false;
    },
  });
};

// Fix: Corrected access to the status property via data
export const useRoomSubmissions = (roomId: string) => {
  return useQuery({
    queryKey: ['rooms', roomId, 'submissions'],
    queryFn: async () => {
      const response = await api.get(`/rooms/${roomId}/submissions`);
      return response.data.submissions as Submission[];
    },
    enabled: !!roomId,
  });
};

// User stats hooks
export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'stats'],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data as UserStats;
    },
    enabled: !!userId,
  });
};

export const useUserRoomStats = (userId: string, roomId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'rooms', roomId, 'stats'],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/room/${roomId}/stats`);
      return response.data;
    },
    enabled: !!userId && !!roomId,
  });
};

// WebSocket hook
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

// For mock data usage
export const useMockChallenges = () => {
  // Sample mock challenges
  const mockChallenges: Challenge[] = [
    {
      id: 'chal-1',
      title: 'Algorithm Sprint',
      creatorId: 'user-1',
      difficulty: 'Easy',
      isPrivate: false,
      problemIds: ['prob-1', 'prob-2', 'prob-3'],
      timeLimit: 60,
      createdAt: new Date().toISOString(),
      isActive: true,
      participantIds: ['user-1', 'user-2', 'user-3']
    },
    {
      id: 'chal-2',
      title: 'Data Structure Challenge',
      creatorId: 'user-2',
      difficulty: 'Medium',
      isPrivate: false,
      problemIds: ['prob-4', 'prob-5', 'prob-6', 'prob-7'],
      timeLimit: 90,
      createdAt: new Date().toISOString(),
      isActive: true,
      participantIds: ['user-2', 'user-4', 'user-5']
    },
    {
      id: 'chal-3',
      title: 'Advanced Algorithms',
      creatorId: 'user-3',
      difficulty: 'Hard',
      isPrivate: true,
      accessCode: 'secret123',
      problemIds: ['prob-8', 'prob-9', 'prob-10'],
      timeLimit: 120,
      createdAt: new Date().toISOString(),
      isActive: true,
      participantIds: ['user-3', 'user-6']
    }
  ];
  
  return { data: mockChallenges, isLoading: false, error: null };
};

export const useMockRoomStatus = (roomId: string) => {
  // Sample mock room data
  const mockRoom: Room = {
    id: roomId || 'room-1',
    challengeId: 'chal-1',
    password: 'pass123',
    status: 'active',
    startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    participantIds: ['user-1', 'user-2', 'user-3', 'user-4'],
    problemIds: ['prob-1', 'prob-2', 'prob-3'],
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
  };
  
  const mockLeaderboard: LeaderboardEntry[] = [
    { userId: 'user-2', problemsCompleted: 2, totalScore: 850, rank: 1 },
    { userId: 'user-1', problemsCompleted: 1, totalScore: 450, rank: 2 },
    { userId: 'user-3', problemsCompleted: 1, totalScore: 400, rank: 3 },
    { userId: 'user-4', problemsCompleted: 0, totalScore: 0, rank: 4 }
  ];
  
  return {
    data: {
      room: mockRoom,
      problemIds: mockRoom.problemIds,
      leaderboard: mockLeaderboard
    },
    isLoading: false,
    error: null
  };
};

export default {
  usePublicChallenges,
  useChallenge,
  useCreateChallenge,
  useJoinChallenge,
  useCreateRoom,
  useJoinRoom,
  useRoomStatus,
  useStartChallenge,
  useEndChallenge,
  useSubmitSolution,
  useSubmission,
  useRoomSubmissions,
  useUserStats,
  useUserRoomStats,
  useWebSocket,
  useMockChallenges,
  useMockRoomStatus,
  useProblems
};
