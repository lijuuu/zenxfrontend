
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { isAuthenticated } from "@/utils/authUtils";
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
import MainNavbar from "@/components/MainNavbar";
import QuickMatch from "./components/challenges/QuickMatch";
import AdminDashboard from "./pages-admin/AdminDashboard";
import MinimalChallenges from "./pages/MinimalChallenges";

// Create the query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
    
    // Add dark class to document by default
    document.documentElement.classList.add('dark');
  }, [location.pathname]);
  
  // Redirect from login/signup if already authenticated
  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    return !isAuthenticated() ? (
      <>{children}</>
    ) : (
      <Navigate to="/dashboard" replace />
    );
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges2" element={<MinimalChallenges />} />
        <Route path="/quick-match" element={<QuickMatch />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/compiler" element={<Compiler />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <SignupForm />
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        } />
        <Route path="/reset-password" element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        } />
        <Route path="/verify-info" element={<VerifyInfo />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/*Admin Dashboard*/}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
