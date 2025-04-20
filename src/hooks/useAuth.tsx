
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '@/api/types';

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  userProfile: UserProfile | null;
  login: (userId: string, profile: UserProfile) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const login = (userId: string, profile: UserProfile) => {
    setUserId(userId);
    setUserProfile(profile);
  };

  const logout = () => {
    setUserId(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!userId,
        userId,
        userProfile,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
