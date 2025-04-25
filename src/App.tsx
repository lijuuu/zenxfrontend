
import React, { Suspense, lazy } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Store
import { store } from './store'

// Lazy load route components
const AuthLayout = lazy(() => import('./components/layout/AuthLayout'))
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/Auth/Register/RegisterPage'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'))
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ZenXPlayground = lazy(() => import('./components/playground/ZenXPlayground'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Problems = lazy(() => import('./pages/Problems'))
const NotFound = lazy(() => import('./pages/NotFound'))
const FollowersPage = lazy(() => import('./pages/FollowersPage'))
const FollowingPage = lazy(() => import('./pages/FollowingPage'))
const Chat = lazy(() => import('./pages/Chat'))
const Compiler = lazy(() => import('./pages/Compiler'))
const MinimalChallenges = lazy(() => import('./pages/MinimalChallenges'))
const ChallengePlayground = lazy(() => import('./pages/ChallengePlayground'))

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
              </Route>
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/playground" element={<ZenXPlayground />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/profile/:userId/followers" element={<FollowersPage />} />
              <Route path="/profile/:userId/following" element={<FollowingPage />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/compiler" element={<Compiler />} />
              <Route path="/challenges" element={<MinimalChallenges />} />
              <Route path="/challenge-playground/:challengeId" element={<ChallengePlayground />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </BrowserRouter>
      </Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default App
