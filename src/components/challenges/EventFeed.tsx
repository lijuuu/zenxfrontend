
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventNotification from './EventNotification';

interface Event {
  type: string;
  message: string;
  username?: string;
  problemName?: string;
  id: number;
}

interface EventFeedProps {
  events: Event[];
  onRemoveEvent: (id: number) => void;
}

const EventFeed: React.FC<EventFeedProps> = ({ events, onRemoveEvent }) => {
  // Display only the most recent 10 events
  const recentEvents = events.slice(-10);
  
  return (
    <div className="space-y-1 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {recentEvents.length > 0 ? (
          recentEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <EventNotification
                type={event.type as any}
                message={event.message}
                username={event.username}
                problemName={event.problemName}
                visible={true}
                onClose={() => onRemoveEvent(event.id)}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center text-zinc-500 text-sm"
          >
            No recent events
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventFeed;
