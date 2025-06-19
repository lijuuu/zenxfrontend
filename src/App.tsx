
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useRef } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Problems from "./pages/Problems";
import Profile from "./pages/Profile";
import ChallengeMain from "./pages/Challenge";
import Chat from "./pages/Chat";
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
import MinimalChallenge from "./pages/MinimalChallenges";
import { useEffect } from "react";
import AdminDashboard from "./pages-admin/AdminDashboard";
// import {MusicPlayer} from "@lijuu/musicplayerwidget";
import MusicPlayer,{Track} from "./components/music/MusicPlayer";

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

        <Route
          path="/music"
          element={
            <MusicPlayer
              className="right-[1%] top-[50%]"
              audioRefProp={useRef(new Audio())}
              newTrack={
                [
                  {
                    title: "Feel Something",
                    artist: "Misanthrop",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/11%20-%20Feel.mp3",
                    image: "https://elementals-images.b-cdn.net/2461bf97-fd5f-406f-8ea4-81b051e70e9c.png",
                  },
                  {
                    title: "The Wrath",
                    artist: "FREDDIE DREAD",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/3%20-%20Wrath%20[Explicit].mp3",
                    image: "https://elementals-images.b-cdn.net/38ba7895-f827-412b-b84c-10e940bb529c.png",
                  },
                  {
                    title: "9mm Reloaded",
                    artist: "Memphis Cult",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/5%20-%209mm%20%5BExplicit%5D.mp3",
                    image: "https://elementals-images.b-cdn.net/7818fb6f-ff27-4a97-9a82-472fd779618d.png",
                  },
                  {
                    title: "Do I Know?",
                    artist: "Travis Scott",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/6%20-%20I%20KNOW%20_%20%5BExplicit%5D.mp3",
                    image: "https://elementals-images.b-cdn.net/73110c16-5440-4899-8c87-b02847d9b56c.png",
                  },
                  {
                    title: "Opa Enui Remix",
                    artist: "Melokind x Enui",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/7%20-%20Opa%20Ga%CC%88a%CC%88rd%20(Enui%20Remix).mp3",
                    image: "https://elementals-images.b-cdn.net/e1d5a8ed-bad1-4ffb-9e85-e5fa3801f9fc.png",
                  },
                  {
                    title: "Night Rave",
                    artist: "Lane 8",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/10%20-%20Rave.mp3",
                    image: "https://elementals-images.b-cdn.net/43d343fc-31b8-4115-bc99-aeb2d39f53db.png",
                  },
                  {
                    title: "Badders Anthem",
                    artist: "PEEKABOO x Flowdan x Skrillex",
                    url: "https://azuki-songs.s3.amazonaws.com/f1/2%20-%20BADDERS%20%5BExplicit%5D.mp3",
                    image: "https://elementals-images.b-cdn.net/0ab85d49-16d8-4787-91c3-ec79c7715c56.png",
                  },
                ] as Track[]
              }
            />
          }
        />


        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/:userid" element={<Profile />} />
        <Route path="/challenges" element={<MinimalChallenge />} />
        <Route path="/challenges2" element={<ChallengeMain />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/playground" element={<Compiler />} />

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

        {/* <Route path="/followers/:userid" element={<FollowersPage />} />
        <Route path="/following/:userid" element={<FollowingPage />} /> */}

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
