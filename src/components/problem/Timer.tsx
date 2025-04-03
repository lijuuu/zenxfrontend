
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Timer = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 backdrop-blur-sm rounded-md shadow-md border border-zinc-700/40" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 text-sm text-zinc-300">
        <Clock className="h-3.5 w-3.5 text-green-500" />
        <span className="font-medium tracking-wide">{formatTime(time)}</span>
      </div>
      <div className="h-3.5 w-px bg-zinc-700/50 mx-0.5"></div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsActive(true)} 
          disabled={isActive} 
          className="h-6 px-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          Start
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { setIsActive(false); setTime(0); }} 
          className="h-6 px-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          Reset
        </Button>
      </div>
    </motion.div>
  );
};

export default Timer;
