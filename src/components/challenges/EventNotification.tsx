
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Code, 
  Trophy, 
  Clock, 
  AlertCircle, 
  User,
  ArrowRight
} from 'lucide-react';

type EventType = 'submit' | 'success' | 'fail' | 'forfeit' | 'win' | 'timeWarning' | 'timeUp' | 'join' | 'connect' | 'start';

interface EventNotificationProps {
  type: EventType;
  message: string;
  username?: string;
  problemName?: string;
  visible: boolean;
  onClose?: () => void;
}

const EventNotification: React.FC<EventNotificationProps> = ({
  type,
  message,
  username,
  problemName,
  visible,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'submit':
        return (
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 360] }} 
            transition={{ duration: 1, repeat: 0 }}
          >
            <Code className="h-4 w-4 text-blue-500" />
          </motion.div>
        );
      case 'success':
        return (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </motion.div>
        );
      case 'fail':
        return (
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 5, -5, 5, -5, 0] }} 
            transition={{ duration: 0.5 }}
          >
            <XCircle className="h-4 w-4 text-red-500" />
          </motion.div>
        );
      case 'forfeit':
        return <User className="h-4 w-4 text-amber-500" />;
      case 'win':
        return (
          <motion.div 
            animate={{ y: [0, -3, 0], scale: [1, 1.2, 1] }} 
            transition={{ duration: 0.5, repeat: 1 }}
          >
            <Trophy className="h-4 w-4 text-amber-500" />
          </motion.div>
        );
      case 'timeWarning':
        return (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <Clock className="h-4 w-4 text-amber-500" />
          </motion.div>
        );
      case 'timeUp':
        return (
          <motion.div 
            animate={{ rotate: [0, 15, -15, 15, -15, 0] }} 
            transition={{ duration: 0.5, repeat: 1 }}
          >
            <Clock className="h-4 w-4 text-red-500" />
          </motion.div>
        );
      case 'join':
        return (
          <motion.div 
            animate={{ x: [-5, 0] }} 
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="h-4 w-4 text-green-500" />
          </motion.div>
        );
      case 'connect':
        return (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </motion.div>
        );
      case 'start':
        return (
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 0.5 }}
          >
            <Clock className="h-4 w-4 text-green-500" />
          </motion.div>
        );
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'submit':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'fail':
        return 'bg-red-500/10 border-red-500/20';
      case 'forfeit':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'win':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'timeWarning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'timeUp':
        return 'bg-red-500/10 border-red-500/20';
      case 'join':
        return 'bg-green-500/10 border-green-500/20';
      case 'connect':
        return 'bg-green-500/10 border-green-500/20';
      case 'start':
        return 'bg-green-500/10 border-green-500/20';
      default:
        return 'bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm border ${getBgColor()} mb-2`}
        >
          {getIcon()}
          <span className="font-medium">
            {username && <span className="text-foreground font-semibold">{username} </span>}
            {message}
            {problemName && <span className="text-foreground font-semibold"> {problemName}</span>}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventNotification;
