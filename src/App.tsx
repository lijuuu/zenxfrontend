import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useAppSelector } from './hooks/useAppSelector';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import MinimalChallenges from './pages/MinimalChallenges';
import Leaderboard from './pages/Leaderboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Compiler from './pages/Compiler';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import QuickMatch from './pages/QuickMatch';
import ChallengeRoom from './components/challenges/ChallengeRoom';
import ChallengePlayground from './pages/ChallengePlayground';
import { auth } from './config/firebase';
import { fetchUserProfile } from './store/slices/authSlice';
import { ThemeProvider } from './components/theme-provider';
import { SocketProvider } from './context/SocketContext';
import { cn } from './lib/utils';
import { useToast } from './hooks/useToast';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.userProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile after successful Firebase authentication
        dispatch(fetchUserProfile(firebaseUser.uid));
      } else {
        // Handle user logout or non-authenticated state
        console.log('No user is currently logged in.');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [dispatch]);

  return (
    <div className="app">
      <SocketProvider userId={user?.userID}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/challenges" element={<MinimalChallenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/users/:id" element={<Profile />} />

            {/* New route for Challenge Playground */}
            <Route path="/challenge-playground/:challengeId" element={<ChallengePlayground />} />
            <Route path="/challenge-room/:challengeId" element={<ChallengeRoom />} />
            <Route path="/quick-match" element={<QuickMatch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
