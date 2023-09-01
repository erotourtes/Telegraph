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
    height: "2rem",
    borderRadius: "10px",
  },
  sendButton: {
    height: "2.3rem",
    borderRadius: "10px",
  },
  group: {
    position: "sticky",
    bottom: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  messages: { minHeight: "calc(100vh - 2rem - 1rem)", marginBottom: "2rem" },
};

function ChatContainer({ chatId }: Props) {
  const [message, setMessage] = useState<string>("");
  const sendMessage = () => {
    fetchSendMessage(chatId, message).then(() => setMessage(""));
  };

  return (
    <>
      <div style={styles.messages}>
        {chatId !== 0 && <ChatMessges chatId={chatId} />}
      </div>

      {chatId !== 0 && (
        <div style={styles.group as React.CSSProperties}>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            style={styles.input as React.CSSProperties}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            style={styles.sendButton as React.CSSProperties}
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      )}
    </>
  );
}

export default ChatContainer;
