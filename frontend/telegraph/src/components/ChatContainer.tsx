import { useState } from "react";
import ChatMessges from "./ChatMessages";
import ws from "@/WS/WS.ts";

interface Props {
  chatId: number;
}

const fetchSendMessage = async (chatId: number, content: string) => {
  await ws.send("message-sent", { chatId, content });
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
              fetchSendMessage(chatId, message).then(() => setMessage(""));
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
