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
      const message = JSON.parse(e.data);
      const { type, payload, success, error } = message;

      // emit to event bus
      EventBus.emit(type, { payload, success, error });

      // invoke callback if exists
      const cb = callbacks.get(type);
      if (cb) cb(message);
      // global console debug to verify real-time
      console.debug(`[WS][${type}]`, message);
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
  const message = { type, payload };
  try {
    if (ws.readyState === WebSocket.OPEN) {
      console.debug(`[WS][send][${type}]`, message);
      ws.send(JSON.stringify(message));
    } else if (ws.readyState === WebSocket.CONNECTING) {
      console.warn(`[WS][send][${type}] socket CONNECTING; will send after open`);
      const handler = () => {
        try {
          console.debug(`[WS][send-after-open][${type}]`, message);
          ws.send(JSON.stringify(message));
        } finally {
          ws.removeEventListener('open', handler as any);
        }
      };
      ws.addEventListener('open', handler as any);
    } else {
      console.warn(`[WS][send][${type}] socket not OPEN (state=${ws.readyState}); recreating and sending`);
      const newWs = getWS();
      const handler = () => {
        try {
          console.debug(`[WS][send-after-reopen][${type}]`, message);
          newWs.send(JSON.stringify(message));
        } finally {
          newWs.removeEventListener('open', handler as any);
        }
      };
      newWs.addEventListener('open', handler as any);
    }
  } catch (e) {
    console.error(`[WS][send][${type}] failed`, e);
  }
}
