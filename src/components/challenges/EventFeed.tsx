
import React from 'react';
import { AnimatePresence } from 'framer-motion';
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
  return (
    <div className="space-y-1 mb-4 max-h-[300px] overflow-y-auto">
      <AnimatePresence>
        {events.map((event) => (
          <EventNotification
            key={event.id}
            type={event.type as any}
            message={event.message}
            username={event.username}
            problemName={event.problemName}
            visible={true}
            onClose={() => onRemoveEvent(event.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EventFeed;
