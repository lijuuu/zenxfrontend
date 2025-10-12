
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
import Settings from "./pages/Settings";
import Compiler from "./pages/Compiler";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/LoginPage";
import SignupForm from "./pages/Auth/Register/RegisterPage";
import VerifyInfo from "./pages/Auth/VerifyInfo"
import AdminLogin from "./pages-admin/AdminLogin";
import UserManagement from "./pages-admin/UserManagement";
import AdminLayout from "./components/layout/AdminLayout";
import { useEffect } from "react";
import AdminDashboard from "./pages-admin/AdminDashboard";
import MinimalChallenges from "./pages/MinimalChallenges";
import CreateChallenge from "./components/challenges/CreateChallengeForm";
import ChallengeLobby from "./pages/Challenge/ChallengeLobby";
import ActiveChallenge from "./pages/Challenge/ActiveChallenge";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 5 * 60 * 1000,
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
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/:userid" element={<Profile />} />

        <Route path="/challenges" element={<MinimalChallenges />} />
        <Route path="/challenge/:challengeId" element={<ActiveChallenge />} />
        <Route path="/join-challenge/:challengeid/:password" element={<ChallengeLobby />} />
        <Route path="/join-challenge/:challengeid" element={<ChallengeLobby />} />

        <Route path="create-challenges" element={<CreateChallenge />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/playground" element={<Compiler />} />
        {/*{contains normal online compiler, per problem, challenge problem solving interfaces}*/}

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-info" element={<VerifyInfo />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        <Route path="/admin/users" element={
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        } />

        {/* <Route path="/followers/:userid" element={<FollowersPage /> }/>
        <Route path="/following/:userid" element={<FollowingPage />} /> */}

        {/* Catch-all invalid route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient} >
      <Provider store={store}>
        <TooltipProvider>

          <AppContent />
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
