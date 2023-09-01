import { WS_URL } from "../constants.ts";

type EventFunction = (...args: any[]) => void;
class EventEmitter<E extends string> {
  private events: { [key: string]: EventFunction[] } = {};

  on(event: E, listener: EventFunction) {
    if (!this.events[event]) this.events[event] = [];

    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]) {
    const listeners = this.events[event];

    listeners?.forEach((listener) => {
      listener(...args);
    });
  }

  removeListener(event: string, listener: EventFunction) {
    const listeners = this.events[event];

    if (!listeners) return;

    const index = listeners.indexOf(listener);

    if (index !== -1) listeners.splice(index, 1);
  }
}

type SendType = "message-sent" | "chat-created";
type ReceiveType = "message-notify" | "chat-notify";
class EmitableWS extends EventEmitter<ReceiveType> {
  private ws: WebSocket | null = null; // lateinit

  close() {
    this.ws?.close();
  }

  async init(shouldReconnect = true) {
    const ws = new WebSocket(WS_URL);
    this.ws = ws;

    const promise = new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log("Connection established.");
        resolve(this);
      };

      ws.onerror = (error) => {
        console.log(`Can't establish a connection: ${error}`);
        reject(error);
      };
    });

    return promise.then(() => {
      ws.onmessage = (event) => {
        try {
          const message = event.data;
          const json = JSON.parse(message.toString());
          this.emit(json.type, json.data);
        } catch (err) {
          console.log(`Can't parse server message (${event.data}) ${err}`);
        }
      };

      ws.onclose = () => {
        if (!shouldReconnect) return;
        const timeout = 1000;
        setTimeout(() => {
          console.log(`Reconnecting...`);
          this.init();
        }, timeout);

        console.log(`Connection closed. Reconnecting after ${timeout}ms ...`);
      };
    });
  }

  async send(type: SendType, data: any) {
    if (!this.ws || this.ws.readyState == WebSocket.CLOSED) await this.init();

    if (
      !this.ws ||
      this.ws.readyState === WebSocket.CLOSING ||
      this.ws.readyState === WebSocket.CLOSED
    )
      throw new Error("WS not open");

    // TODO: wtf; it can't send first connection with 100 timeout
    let timeout = 100;
    setTimeout(() => {
      timeout = 0;
      this.ws?.send(JSON.stringify({ type, data }));
    }, timeout);
  }

  toString() {
    return "EmitableWS: " + this.ws?.readyState ?? "null";
  }
}

const emitableWS = new EmitableWS();

export default emitableWS;
