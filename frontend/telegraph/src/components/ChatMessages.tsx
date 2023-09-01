import { useEffect, useState } from "react";
import { useAuth } from "./Auth/AuthContext";
import { useChat } from "./Chat/ChatContext";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  message: {
    backgroundColor: "orange",
    color: "white",
    padding: "0.5rem",
    borderRadius: "10px",
    margin: "0.5rem",
    alignSelf: "flex-start",
    minWidth: "25rem",
  },
  sender: {
    alignSelf: "flex-end",
  },
  sentAt: {
    fontSize: "1rem",
    textAlign: "right",
    margin: 0,
  },
};

function ChatMessges({ chatId }: { chatId: number }) {
  const [curPage, setCurPage] = useState<number>(1);
  const [isUnreadMessages, setIsUnreadMessages] = useState<boolean>(false);
  const { user } = useAuth();

  console.log("Rendeting chat messages", chatId);

  const messagesProvider = useChat();
  const chatMessages = messagesProvider.messages[chatId] || {};

  useEffect(() => {
    messagesProvider.updateMessagesForPage(chatId, curPage);
  }, [curPage, chatId]);

  const getMessageTime = (sentAt: string) => {
    const date = new Date(sentAt);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const curMessages = chatMessages[curPage] || [];
  const messagesList = curMessages?.map((message) => (
    <div
      style={
        message.user_id === user?.user_id
          ? { ...styles.message, ...styles.sender }
          : styles.message
      }
      key={message.message_id}
    >
      <p>{message.content}</p>
      <p style={styles.sentAt as React.CSSProperties}>
        {getMessageTime(message.sent_at)}
      </p>
    </div>
  ));

  return (
    <>
      <div style={styles.container as React.CSSProperties}>
        <h1>Messages (cur page is {curPage})</h1>

        {isUnreadMessages && (
          <button
            onClick={() => {
              setCurPage(1);
              setIsUnreadMessages(false);
            }}
          >
            View unread messages
          </button>
        )}

        {curMessages?.length == 0 && <p>No futher messages</p>}

        {messagesList}

        <div>
          <button
            disabled={curMessages.length == 0}
            onClick={() => setCurPage((curPage) => curPage + 1)}
          >
            Prev chunk
          </button>
          <button
            disabled={curPage == 1}
            onClick={() => setCurPage((curPage) => curPage - 1)}
          >
            Next chunk
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatMessges;
