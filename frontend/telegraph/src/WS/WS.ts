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
type ReceiveType = "message-notify";
class EmitableWS extends EventEmitter<ReceiveType> {
  private ws: WebSocket = {} as WebSocket; // lateinit

  close() {
    this.ws.close();
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
        setTimeout(() => {
          console.log("Reconnecting once after 5000ms...");
          this.init();
        }, 5000);

        console.log("Connection closed. reconnecting...");
      };
    });
  }

  send(type: SendType, data: any) {
    if (this.ws.readyState !== WebSocket.OPEN)
      this.init().then(() => {
        this.ws.send(JSON.stringify({ type, data }));
      });
    else this.ws.send(JSON.stringify({ type, data }));
  }
}

const emitableWS = new EmitableWS();

export default emitableWS;
