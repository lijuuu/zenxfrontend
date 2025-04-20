
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AccentColorProvider } from "./contexts/AccentColorContext";
import ThemeSwitcher from "./components/common/ThemeSwitcher";
import { AuthProvider } from "./hooks/useAuth";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/Register/RegisterPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import SetUpTwoFactor from "./pages/Auth/SetUpTwoFactor";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProblemsPage from "./pages/Problems";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Compiler from "./pages/Compiler";
import Settings from "./pages/Settings";
import MinimalChallenges from "./pages/MinimalChallenges";
import ChallengeRoom from "./components/challenges/ChallengeRoom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import VerifyInfo from "./pages/Auth/VerifyInfo";
import Leaderboard from "./pages/Leaderboard";
import Chat from "./pages/Chat";

import AdminPanel from "./pages-admin/AdminDashboard";
import ProblemDetails from "./pages-admin/ProblemsDetails";
import TestCases from "./pages-admin/TestCases";
import ApiRouteHistory from "./pages-admin/ApiResponseHistory";
import LanguagesList from "./pages-admin/Languages";
import Validate from "./pages-admin/Validate";
import CodesProblemsList from "./pages-admin/ProblemsList";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccentColorProvider>
          <AuthProvider>
            <Toaster richColors position="top-center" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/setup-2fa" element={<SetUpTwoFactor />} />
              <Route path="/auth/verify-info" element={<VerifyInfo />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/challenges" element={<MinimalChallenges />} />
              <Route path="/challenge-room/:challengeId" element={<ChallengeRoom />} />
              <Route path="/compiler" element={<Compiler />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/chat" element={<Chat />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/problem-detail/:id" element={<ProblemDetails />} />
              <Route path="/admin/testcases/:id" element={<TestCases />} />
              <Route path="/admin/api-history" element={<ApiRouteHistory />} />
              <Route path="/admin/languages" element={<LanguagesList />} />
              <Route path="/admin/validate" element={<Validate />} />
              <Route path="/admin/problems" element={<CodesProblemsList />} />

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ThemeSwitcher />
          </AuthProvider>
        </AccentColorProvider>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
