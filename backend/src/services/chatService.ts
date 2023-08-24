import * as query from "../sql/sql.js";
import { ChatDB, MessageDB } from "../sql/types.js";

export const getChatId = async ({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) => {
  const [rows] = await query.getChatIdQuery({ userId, username });

  return rows as { chat_id: number }[];
};

export const getChatMessages = async ({
  userId,
  username,
}: {
  userId: number;
  username: string;
}) => {
  const rows = await getChatId({ userId, username });

  const chatId = rows.at(0)?.chat_id;
  if (!chatId) throw new Error("Chat is not found");

  const [messages] = await query.getChatMessagesQuery({ chatId });

  return messages as MessageDB[];
};

export const getAllUserChats = async ({ userId }: { userId: number }) => {
  if (!userId) throw new Error("UserId is undefinded");

  const [rows] = await query.getAllUserChatsQuery({ userId });

  return rows as ChatDB[];
};

export const getChatMessagesByChatId = async ({
  userId,
  chatId,
}: {
  userId: number;
  chatId: number;
}) => {
  if (!userId || !chatId) throw new Error("UserId or chatId is undefinded");

  const [isUserInChat] = await query.isUserInChatQuery({ userId, chatId });
  const isAllowed = (isUserInChat as { user_in_chat: number }[]).length > 0;

  if (!isAllowed) throw new Error("User is not in the chat");

  const [rows] = await query.getChatMessagesQuery({ chatId });

  return rows as MessageDB[];
};
