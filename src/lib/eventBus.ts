// lib/eventBus.ts
type EventHandler<T = any> = (data: T) => void;

const listeners = new Map<string, Set<EventHandler>>();

export const EventBus = {
  on<T = any>(event: string, handler: EventHandler<T>) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler as EventHandler);
  },

  off<T = any>(event: string, handler: EventHandler<T>) {
    listeners.get(event)?.delete(handler as EventHandler);
  },

  emit<T = any>(event: string, data: T) {
    listeners.get(event)?.forEach((handler) => {
      handler(data);
    });
  },
};
