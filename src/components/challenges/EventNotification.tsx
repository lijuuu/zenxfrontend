
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Code, Trophy, Clock, AlertCircle, User } from 'lucide-react';

type EventType = 'submit' | 'success' | 'fail' | 'forfeit' | 'win' | 'timeWarning' | 'timeUp' | 'join';

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
        return <Code className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'forfeit':
        return <User className="h-4 w-4 text-amber-500" />;
      case 'win':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'timeWarning':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'timeUp':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'join':
        return <User className="h-4 w-4 text-green-500" />;
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
            {username && <span className="text-foreground">{username} </span>}
            {message}
            {problemName && <span className="text-foreground"> {problemName}</span>}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventNotification;
