import { useEffect, useCallback } from "react";
import { EventBus } from "../lib/eventBus";

export function useWSEvent<T = any>(event: string, handler: (data: T) => void) {
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    EventBus.on(event, stableHandler);
    return () => EventBus.off(event, stableHandler);
  }, [event, stableHandler]);
}
