import { useState } from "react";
import ChatMessges from "./ChatMessages";
import ws from "@/WS/WS.ts";

interface Props {
  chatId: number;
}

const fetchSendMessage = async (chatId: number, content: string) => {
  await ws.send("message-sent", { chatId, content });
};

const styles = {
  input: {
    width: "80%",
    position: "absolute",
    bottom: "2rem",
    height: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "10px",
  },
  sendButton: {
    position: "absolute",
    bottom: "2rem",
    right: "2rem",
    height: "2.3rem",
    borderRadius: "10px",
  },
};

function ChatContainer({ chatId }: Props) {
  const [message, setMessage] = useState<string>("");

  return (
    <>
      {chatId !== 0 && <ChatMessges chatId={chatId} />}

      {chatId !== 0 && (
        <>
          <input
            style={styles.input as React.CSSProperties}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            style={styles.sendButton as React.CSSProperties}
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
