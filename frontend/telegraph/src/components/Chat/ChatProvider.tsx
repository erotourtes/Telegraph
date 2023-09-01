import { ReactNode, useCallback, useEffect, useState } from "react";
import ChatContext from "./ChatContext.ts";
import { MessageInfo, MessageWithUserI } from "@/interfaces.ts";
import ws from "@/WS/WS.ts";
import { BASE_URL, PAGE_SIZE } from "@/constants.ts";

type ChatMessages = {
  // key is page number
  [key: number]: MessageInfo[];
};

type AllMessages = {
  // key is chatId
  [key: number]: ChatMessages;
};

const getChatMessages = (messages: AllMessages, chatId: number) => {
  return messages[chatId] || {};
};

const getMessagesForPage = (
  messages: AllMessages,
  chatId: number,
  curPage: number
) => {
  const chatMessages = getChatMessages(messages, chatId);

  return chatMessages[curPage] || [];
};

const getMessagesForFirstPage = (messages: AllMessages, chatId: number) => {
  return getMessagesForPage(messages, chatId, 1);
};

const fetchChatMessages = async (
  allMessages: AllMessages,
  chatId: number,
  curPage: number
) => {
  if (curPage == 1) {
    const response = await fetch(
      `${BASE_URL}/api/v1/chat/messages-by-chat-id?chatId=${chatId}&numOfMessages=${PAGE_SIZE}`,
      {
        credentials: "include",
        method: "GET",
      }
    );
    return (await response.json()) as {
      data: { messages: MessageWithUserI[] };
    };
  }

  const messagesInFirstPage = getMessagesForPage(allMessages, chatId, 1).length;
  const skip = messagesInFirstPage + (curPage - 1) * PAGE_SIZE;

  const response = await fetch(
    `${BASE_URL}/api/v1/chat/messages-by-chat-id?chatId=${chatId}&skip=${skip}&numOfMessages=${PAGE_SIZE}`,
    {
      credentials: "include",
      method: "GET",
    }
  );
  return (await response.json()) as { data: { messages: MessageWithUserI[] } };
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AllMessages>({});

  const addMessagesToPage = useCallback(
    (chatId: number, curPage: number, newMessages: MessageWithUserI[]) => {
      if (getMessagesForFirstPage(messages, chatId).length !== 0) return;

      const newMessagesInfo = newMessages.map((message) => ({
        ...message,
        isRead: false,
      }));

      const chatMessages = messages[chatId] || {};
      const updatedMessages = [
        ...(chatMessages[curPage] || []),
        ...newMessagesInfo,
      ];

      setMessages((prevState) => {
        return {
          ...prevState,
          [chatId]: {
            ...chatMessages,
            [curPage]: updatedMessages,
          },
        };
      });
    },
    [messages]
  );

  const updateMessagesForPage = useCallback(
    async (chatId: number, curPage: number) => {
      if (getMessagesForFirstPage(messages, chatId).length !== 0) return;

      console.log("fetching messages for page: ", curPage);
      const response = await fetchChatMessages(messages, chatId, curPage);
      const fetchedMessages = response.data.messages;

      addMessagesToPage(chatId, curPage, fetchedMessages.reverse());
    },
    [messages]
  );

  useEffect(() => {
    const cb = ({ message }: { message: MessageWithUserI }) => {
      const chatId = message.chat_id;

      const messageInfo = {
        ...message,
        isRead: false,
      };

      setMessages((messages: AllMessages) => {
        const chatMessages = messages[chatId] || {};
        const lastPage = 1;
        const updatedMessages = [
          ...(chatMessages[lastPage] || []),
          messageInfo,
        ];

        const allNewMessages = {
          ...messages,
          [chatId]: {
            ...chatMessages,
            [lastPage]: updatedMessages,
          },
        };

        return allNewMessages;
      });
    };

    ws.on("message-notify", cb);

    return () => {
      ws.removeListener("message-notify", cb);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        addMessagesToPage,
        updateMessagesForPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
