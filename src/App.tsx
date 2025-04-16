
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Problems from "./pages/Problems";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Compiler from "./pages/Compiler";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/LoginPage";
import SignupForm from "./pages/Auth/Register/RegisterPage";
import VerifyInfo from "./pages/Auth/VerifyInfo"
import QuickMatch from "./components/challenges/QuickMatch";
import AdminDashboard from "./pages-admin/AdminDashboard";
import MinimalChallenge from "./pages/MinimalChallenges";
import BattleInterface from "./components/challenges/BattleInterface";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const AppContent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/challenges" element={<MinimalChallenge />} />
        <Route path="/challenges2" element={<Challenges />} />
        <Route path="/quick-match" element={<QuickMatch />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/compiler" element={<Compiler />} />
        <Route path="/battle/:roomId" element={<BattleInterface />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-info" element={<VerifyInfo />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/*Admin Dashboard*/}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
