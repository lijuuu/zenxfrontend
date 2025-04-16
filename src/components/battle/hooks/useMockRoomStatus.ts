
import { useState } from 'react';
import { RoomData } from '../types';
import { getMockRoomData } from '../utils/mockData';

export const useMockRoomStatus = (roomId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<RoomData | null>(null);
  
  useState(() => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      try {
        const mockData = getMockRoomData(roomId);
        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }, 500);
  });
  
  return { data, isLoading, error };
};

export default useMockRoomStatus;
