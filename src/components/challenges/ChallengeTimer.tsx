
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeTimerProps {
  endTime: number;
  onTimeWarning?: () => void;
  onTimeUp?: () => void;
  className?: string;
  compact?: boolean;
}

const ChallengeTimer: React.FC<ChallengeTimerProps> = ({ 
  endTime, 
  onTimeWarning, 
  onTimeUp,
  className,
  compact = false
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [warningTriggered, setWarningTriggered] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;
      setTimeLeft(difference > 0 ? difference : 0);
      
      // Trigger warning when 5 minutes or less remain
      if (difference <= 5 * 60 * 1000 && difference > 0 && !warningTriggered) {
        setWarningTriggered(true);
        if (onTimeWarning) onTimeWarning();
      }
      
      // Trigger time up when time is over
      if (difference <= 0) {
        clearInterval(interval);
        if (onTimeUp) onTimeUp();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeWarning, onTimeUp, warningTriggered]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (compact) {
      return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }

    return [
      hours > 0 ? `${hours}h` : '',
      `${minutes.toString().padStart(2, '0')}m`,
      `${seconds.toString().padStart(2, '0')}s`
    ].filter(Boolean).join(' ');
  };

  const getProgressPercentage = (): number => {
    const totalDuration = endTime - Date.now() + timeLeft; // Estimated total duration
    return Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));
  };

  // Determine color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 60 * 1000) return 'text-red-500'; // Less than 1 minute: red
    if (timeLeft <= 5 * 60 * 1000) return 'text-amber-500'; // Less than 5 minutes: amber
    return 'text-green-500'; // More than 5 minutes: green
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: timeLeft <= 60 * 1000 ? [1, 1.1, 1] : 1,
            transition: { 
              repeat: timeLeft <= 60 * 1000 ? Infinity : 0, 
              duration: 1
            }
          }}
        >
          {timeLeft <= 5 * 60 * 1000 ? (
            <AlertCircle className={`h-4 w-4 ${getTimerColor()}`} />
          ) : (
            <Timer className={`h-4 w-4 ${getTimerColor()}`} />
          )}
        </motion.div>
        <span className={`text-sm font-mono font-medium ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2 font-mono">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: timeLeft <= 60 * 1000 ? [1, 1.1, 1] : 1,
            transition: { 
              repeat: timeLeft <= 60 * 1000 ? Infinity : 0, 
              duration: 1
            }
          }}
        >
          {timeLeft <= 5 * 60 * 1000 ? (
            <AlertCircle className={`h-4 w-4 ${getTimerColor()}`} />
          ) : (
            <Timer className={`h-4 w-4 ${getTimerColor()}`} />
          )}
        </motion.div>
        <motion.span 
          className={`text-sm font-semibold ${getTimerColor()}`}
          animate={{ 
            scale: timeLeft <= 60 * 1000 ? [1, 1.02, 1] : 1 
          }}
          transition={{ 
            repeat: timeLeft <= 60 * 1000 ? Infinity : 0, 
            duration: 0.5 
          }}
        >
          {formatTime(timeLeft)}
        </motion.span>
      </div>
      <div className="w-full h-1 mt-2 bg-zinc-700/50 rounded-full overflow-hidden">
        <motion.div 
          className={cn(
            "h-full rounded-full",
            timeLeft <= 60 * 1000 ? "bg-red-500" : 
            timeLeft <= 5 * 60 * 1000 ? "bg-amber-500" : 
            "bg-green-500"
          )}
          style={{ width: `${getProgressPercentage()}%` }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default ChallengeTimer;
