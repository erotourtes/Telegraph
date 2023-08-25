import { useState } from "react";
import ChatMessges from "./ChatMessages";
import { WS_URL } from "../constants";

interface Props {
  chatId: number;
}

const ws = new WebSocket(WS_URL);
ws.onopen = () => {
  console.log("Connection established.");
  ws.send(JSON.stringify({ type: "username", username: "test" }));
};

ws.onmessage = (event) => {
  console.log(`Message: ${event.data}`);
};

ws.onclose = () => {
  setTimeout(() => {
    console.log("Reconnecting...");
  }, 1000);

  console.log("Connection closed.");
};

ws.onerror = (error) => {
  console.log(`Error: ${error}`);
};

const fetchSendMessage = async (chatId: number, content: string) => {
  ws.send(JSON.stringify({ type: "message-sent", data: { chatId, content } }));
};

function ChatContainer({ chatId }: Props) {
  const [message, setMessage] = useState<string>("");

  return (
    <>
      {chatId !== 0 && <ChatMessges chatId={chatId} />}

      {chatId !== 0 && (
        <>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => {
              fetchSendMessage(chatId, message);
            }}
          >
            Send
          </button>
        </>
      )}
    </>
  );
}

export default ChatContainer;
