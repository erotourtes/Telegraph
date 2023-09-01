import { useContext, createContext } from "react";
import { MessageInfo, MessageWithUserI } from "@/interfaces";

type ChatId = number;

const context = createContext<{
  messages: { [key: ChatId]: { [key: number]: MessageInfo[] } };
  setMessages: (value: {
    [key: ChatId]: { [key: number]: MessageInfo[] };
  }) => void;

  addMessagesToPage: (
    chatId: ChatId,
    curPage: number,
    messages: MessageWithUserI[]
  ) => void;

  updateMessagesForPage: (chatId: number, page: number) => void;
}>({
  messages: {},
  setMessages: () => {},
  addMessagesToPage: () => {},
  updateMessagesForPage: () => {
    throw new Error("Not implemented");
  },
});

export default context;
export const useChat = () => useContext(context);
