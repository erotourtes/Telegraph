import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import { MessageWithUserI } from "@/interfaces";
import ws from "@/WS/WS";

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

function ChatMessges({ chatId }: { chatId: number }) {
  // TODO save users not to fetch them every time
  const [messagesByPage, setMessagesByPage] = useState<{
    [page: number]: MessageWithUserI[];
  }>({});
  const [curPage, setCurPage] = useState<number>(1);
  const [isUnreadMessages, setIsUnreadMessages] = useState<boolean>(false);

  useEffect(() => {
    async function messages() {
      if (messagesByPage[curPage]) return;

      console.log("making a request for page " + curPage);

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

  const curMessages = messagesByPage[curPage] || [];
  const messagesList = curMessages?.map((message) => (
    <li key={message.message_id}>
      <p>{message.content}</p>
      <p>
        by {message.username} **at {message.sent_at}
      </p>
    </li>
  ));

  return (
    <>
      <div>
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

        <ul>{messagesList}</ul>
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
    </>
  );
}

export default ChatMessges;
