import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import { MessageWithUserI } from "@/interfaces";
import ws from "@/WS/WS";
import { useAuth } from "./Auth/AuthContext";
import { usePrevious } from "./Hooks/usePrevious";

const fetchChatMessages = async (chatId: number, page: number) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/chat/messages-by-chat-id?chatId=${chatId}&page=${page}`,
    {
      credentials: "include",
      method: "GET",
    }
  );

  if (!response.ok) {
    console.log({ error: "Something went wrong, can't get messagse" });

    return { data: { messages: [] } };
  }

  return (await response.json()) as { data: { messages: MessageWithUserI[] } };
};

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
  // TODO save users not to fetch them every time
  const [messagesByPage, setMessagesByPage] = useState<{
    [page: number]: MessageWithUserI[];
  }>({});
  const [curPage, setCurPage] = useState<number>(1);
  const [isUnreadMessages, setIsUnreadMessages] = useState<boolean>(false);
  const { user } = useAuth();
  console.log("Rendeting chat messages", chatId);
  const prevChatId = usePrevious(chatId);
  const isChatChanged = chatId !== prevChatId;

  useEffect(() => {
    async function messages() {
      if (messagesByPage[curPage] && !isChatChanged) return;

      const {
        data: { messages },
      } = await fetchChatMessages(chatId, curPage);

      // TODO: WTF?
      messages.reverse(); // works
      // const newMsg = messages.reverse(); // works

      setMessagesByPage((messagesByPage) => ({
        ...messagesByPage,
        [curPage]: messages,
        // [curPage]: messages.reverse(), // does't work
        // [curPage]: newMsg,
      }));
    }

    messages();
  }, [chatId, curPage, messagesByPage]); // TODO use memo hook, or save messages upper in the tree

  useEffect(() => {
    const cb = ({ message }: { message: MessageWithUserI }) => {
      console.log("got a new message for", chatId);
      if (message.chat_id !== chatId) return;

      console.log("got a new message");

      if (curPage !== 1) setIsUnreadMessages(true);

      setMessagesByPage((lastPageMsg) => {
        const lastPage = 1;
        const lastPageMessages = lastPageMsg[lastPage];
        const newMessages = [...lastPageMessages, message];

        return { ...lastPageMsg, [lastPage]: newMessages };
      });
    };

    ws.on("message-notify", cb);

    return () => {
      ws.removeListener("message-notify", cb);
    };
  }, [chatId, curPage]);

  const getMessageTime = (sentAt: string) => {
    const date = new Date(sentAt);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  const curMessages = messagesByPage[curPage] || [];
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
      <p style={styles.sentAt as React.CSSProperties}>{getMessageTime(message.sent_at)}</p>
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
