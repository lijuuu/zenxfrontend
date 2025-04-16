
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Zap, Clock, UserCheck, X, Copy, Users, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import MainNavbar from '@/components/common/MainNavbar';

const QuickMatch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const password = searchParams.get('password');
  const difficulty = searchParams.get('difficulty') || 'Easy';
  const mode = searchParams.get('mode') || 'quick';
  
  const [status, setStatus] = useState<'idle' | 'waiting' | 'ready' | 'starting' | 'active'>('idle');
  const [participants, setParticipants] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [waitTime, setWaitTime] = useState(0);
  const navigate = useNavigate();

  // Load room details on component mount
  useEffect(() => {
    if (roomId && password) {
      // We have room details, so we're either joining or creating a room
      setStatus('waiting');
      // In a real app, we would connect to a backend service here
      
      // Simulate adding the current user to the room
      setParticipants(prev => [...prev, 'You']);
      
      // For friend challenges, wait for others to join
      if (mode === 'friend') {
        // Wait for participants
      } else {
        // For quick matches, simulate finding another participant quickly
        setTimeout(() => {
          setParticipants(prev => [...prev, 'Random Opponent']);
          setStatus('ready');
        }, 2000);
      }
    } else {
      // No room details, redirect to challenges page
      navigate('/challenges2');
    }
  }, [roomId, password, mode, navigate]);

  // Handle waiting time counter
  useEffect(() => {
    if (status === 'waiting') {
      const interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
        
        // For demo purposes, add a random user after some time
        if (waitTime > 5 && participants.length === 1 && Math.random() > 0.7) {
          setParticipants(prev => [...prev, 'Friend']);
          setStatus('ready');
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, waitTime, participants.length]);

  // Handle countdown when match is ready to start
  useEffect(() => {
    if (status === 'starting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'starting' && countdown === 0) {
      setStatus('active');
      // In a real implementation, this would load the actual problem
    }
  }, [status, countdown]);

  const startMatch = () => {
    setStatus('starting');
    setCountdown(3);
  };

  const cancelMatch = () => {
    navigate('/challenges2');
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/quick-match?room=${roomId}&password=${password}&difficulty=${difficulty}&mode=${mode}`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MainNavbar />
      
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
          <div className={`p-6 ${
            status === 'active' ? 'bg-blue-600/20' : 
            status === 'starting' ? 'bg-green-600/20' : 
            status === 'ready' ? 'bg-amber-600/20' : 
            status === 'waiting' ? 'bg-purple-600/20' : ''
          }`}>
            <div className="text-center py-4">
              {status === 'waiting' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-purple-600/20">
                        <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                        {waitTime}s
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Waiting for participants...</h2>
                    <p className="text-zinc-400 mt-2">
                      {mode === 'friend' ? 'Share the room link with your friends to join' : 'Looking for someone to join this challenge'}
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium">Room Details</h3>
                      <Button size="sm" variant="ghost" className="h-7" onClick={copyRoomLink}>
                        <Copy className="h-3 w-3 mr-1" /> Copy Link
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-zinc-700/50 p-2 rounded">
                        <span className="text-zinc-400">Room ID:</span>
                        <div className="font-mono">{roomId}</div>
                      </div>
                      <div className="bg-zinc-700/50 p-2 rounded">
                        <span className="text-zinc-400">Password:</span>
                        <div className="font-mono">{password}</div>
                      </div>
                      <div className="bg-zinc-700/50 p-2 rounded">
                        <span className="text-zinc-400">Difficulty:</span>
                        <div className="font-mono">{difficulty}</div>
                      </div>
                      <div className="bg-zinc-700/50 p-2 rounded">
                        <span className="text-zinc-400">Mode:</span>
                        <div className="font-mono">{mode === 'friend' ? 'Friend Challenge' : 'Quick Match'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3">Participants ({participants.length}/5)</h3>
                    <div className="space-y-2">
                      {participants.map((name, index) => (
                        <div key={index} className="flex items-center gap-2 bg-zinc-700/50 p-2 rounded">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>{name}</span>
                          {index === 0 && <span className="ml-auto text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">You</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={cancelMatch} 
                    variant="outline" 
                    className="w-full border-red-600 text-red-500"
                  >
                    <X className="mr-2 h-5 w-5" /> Cancel Challenge
                  </Button>
                </div>
              )}
              
              {status === 'ready' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div 
                        className="w-24 h-24 rounded-full flex items-center justify-center bg-amber-600/20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <UserCheck className="h-10 w-10 text-amber-400" />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">All Participants Ready!</h2>
                    <p className="text-zinc-400 mt-2">
                      {participants.length} participants have joined this challenge
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3">Participants</h3>
                    <div className="space-y-2">
                      {participants.map((name, index) => (
                        <div key={index} className="flex items-center gap-2 bg-zinc-700/50 p-2 rounded">
                          <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-400" />
                          </div>
                          <span>{name}</span>
                          {index === 0 && <span className="ml-auto text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">You</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                    <Clock className="h-4 w-4" />
                    <span>Time Limit: 20 minutes</span>
                    <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-xs">
                      {difficulty}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={cancelMatch} 
                      variant="outline" 
                      className="flex-1 border-red-600 text-red-500"
                    >
                      <X className="mr-2 h-5 w-5" /> Cancel
                    </Button>
                    <Button 
                      onClick={startMatch} 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Zap className="mr-2 h-5 w-5" /> Start Challenge
                    </Button>
                  </div>
                </div>
              )}
              
              {status === 'starting' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div 
                        className="w-24 h-24 rounded-full flex items-center justify-center bg-green-600/20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                      >
                        <div className="text-4xl font-bold text-green-400">{countdown}</div>
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Challenge Starting...</h2>
                    <p className="text-zinc-400 mt-2">
                      Get ready! The problem will appear in {countdown} seconds.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-2 py-1 rounded bg-green-600/20 text-green-400 text-sm">
                      {difficulty}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="flex items-center text-sm text-zinc-400">
                      <Clock className="h-4 w-4 mr-1" /> 20 minutes
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="flex items-center text-sm text-zinc-400">
                      <Users className="h-4 w-4 mr-1" /> {participants.length} participants
                    </span>
                  </div>
                </div>
              )}
              
              {status === 'active' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div 
                        className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-600/20"
                      >
                        <Zap className="h-10 w-10 text-blue-400" />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Challenge Active!</h2>
                    <p className="text-zinc-400 mt-2">
                      Your problem would be displayed here in a real implementation.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-amber-400 mr-2" />
                      <p className="text-amber-300">This is a demo implementation</p>
                    </div>
                    <p className="text-center text-zinc-400 mt-2">
                      In a real app, the coding interface would be displayed here
                    </p>
                  </div>
                  
                  <Button 
                    onClick={cancelMatch} 
                    variant="outline" 
                  >
                    <X className="mr-2 h-5 w-5" /> Exit Challenge
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMatch;
