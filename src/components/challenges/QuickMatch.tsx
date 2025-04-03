
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Zap, Clock, UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const QuickMatch: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [searchTime, setSearchTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'searching') {
      const interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
        // Simulate finding a match after 3-5 seconds
        if (searchTime > 3 && Math.random() > 0.7) {
          setStatus('matched');
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, searchTime]);

  useEffect(() => {
    if (status === 'matched' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'matched' && countdown === 0) {
      // Redirect to the problem solving page with randomized problem ID
      navigate('/compiler?problem_id=easy_' + Math.floor(Math.random() * 1000));
    }
  }, [status, countdown, navigate]);

  const startMatching = () => {
    setStatus('searching');
    setSearchTime(0);
  };

  const cancelMatching = () => {
    setStatus('idle');
    setSearchTime(0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-16">
      <div className="container mx-auto py-8">
        
        <div className="max-w-md mx-auto bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
          <div className={`p-6 ${status === 'matched' ? 'bg-green-600/20' : status === 'searching' ? 'bg-amber-600/20' : ''}`}>
            <div className="text-center py-4">
              {status === 'idle' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-green-600">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Ready for a Quick Match?</h2>
                    <p className="text-zinc-400 mt-2">
                      You'll be matched with an opponent of similar skill for an Easy difficulty problem.
                      You'll have 5 minutes to solve it!
                    </p>
                  </div>
                  <Button 
                    onClick={startMatching} 
                    className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="mr-2 h-5 w-5" /> Start Quick Match
                  </Button>
                </div>
              )}
              
              {status === 'searching' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-amber-600/20">
                        <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs">
                        {searchTime}s
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Searching for an opponent...</h2>
                    <p className="text-zinc-400 mt-2">
                      Looking for someone with a similar skill level. This won't take long!
                    </p>
                  </div>
                  <Button 
                    onClick={cancelMatching} 
                    variant="outline" 
                    className="w-full border-amber-600 text-amber-500"
                  >
                    <X className="mr-2 h-5 w-5" /> Cancel
                  </Button>
                </div>
              )}
              
              {status === 'matched' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div 
                        className="w-24 h-24 rounded-full flex items-center justify-center bg-green-600/20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <UserCheck className="h-10 w-10 text-green-400" />
                      </motion.div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        {countdown}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Opponent Found!</h2>
                    <p className="text-zinc-400 mt-2">
                      Get ready! You'll be redirected to the problem in {countdown} seconds.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                    <Clock className="h-4 w-4" />
                    <span>Time Limit: 5 minutes</span>
                    <span className="px-2 py-0.5 rounded bg-green-600/20 text-green-400 text-xs">Easy</span>
                  </div>
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
