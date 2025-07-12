import { getWS } from "./ws";
import { EventBus } from "./eventBus";

const callbacks: Map<string, (payload: any) => void> = new Map();

let initialized = false;

export function initWSHandler(url?: string) {
  if (initialized) return;
  initialized = true;

  const ws = getWS(url);

  ws.onopen = () => console.log("[WS] Connected");

  ws.onmessage = (e: MessageEvent) => {
    try {
      const { type, payload } = JSON.parse(e.data);

      // emit to event bus
      EventBus.emit(type, payload);

      // invoke callback if exists
      const cb = callbacks.get(type);
      if (cb) cb(payload);
    } catch (err) {
      console.error("[WS] Invalid message", err);
    }
  };

  ws.onclose = () => {
    console.warn("[WS] Disconnected");
    initialized = false;
  };

  ws.onerror = (e) => {
    console.error("[WS] Error", e);
  };
}

//send wrapper with inline callback map
export function sendWSEvent(type: string, payload: any, cb?: (payload: any) => void) {
  const ws = getWS();
  if (cb) callbacks.set(type, cb);
  ws.send(JSON.stringify({ type, payload }));
}
