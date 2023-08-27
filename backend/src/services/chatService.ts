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
  skip,
  take,
}: {
  userId: number;
  username: string;
  skip: number | null;
  take: number | null;
}) => {
  if (!userId || !username) throw new Error("Params shoudn't be undefinded");

  const rows = await getChatId({ userId, username });

  const chatId = rows.at(0)?.chat_id;
  if (!chatId) throw new Error("Chat is not found");

  const [messages] = await query.getChatMessagesQuery({
    chatId,
    skip,
    take,
  });

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
  skip,
  take,
}: {
  userId: number;
  chatId: number;
  skip: number | null;
  take: number | null;
}) => {
  if (!userId || !chatId) throw new Error("UserId or chatId is undefinded");

  const [isUserInChat] = await query.isUserInChatQuery({ userId, chatId });
  const isAllowed = (isUserInChat as { user_in_chat: number }[]).length > 0;

  if (!isAllowed) throw new Error("User is not in the chat");

  const [rows] = await query.getChatMessagesQuery({
    chatId,
    skip,
    take,
  });

  return rows as (MessageDB & { username: string })[];
};

export const createChat = async ({
  username2,
  userId,
  username1,
}: {
  username1: string;
  userId: number;
  username2: string;
}) => {
  if (!username1 || !userId || !username2)
    throw new Error("Username is undefinded");

  const [rows] = await query.createChat({ username1, username2, userId });

  if (!rows) throw new Error("Can't create a chat");

  return rows[0] as ChatDB;
};

export const addMessage = async ({
  chatId,
  userId,
  content,
}: {
  chatId: number;
  userId: number;
  content: string;
}) => {
  if (!chatId || !userId || content === undefined)
    throw new Error("Params shoudn't be undefinded");

  const [rows] = await query.addMessage({ chatId, userId, content });

  if (!rows) throw new Error("Can't add a message");

  return rows[0] as MessageDB & { username: string };
};

export const getOtherUserId = async ({
  userId,
  chatId,
}: {
  userId: number;
  chatId: number;
}) => {
  if (!userId || !chatId) throw new Error("Params shoudn't be undefinded");

  const [rows] = await query.getOtherUserId({ userId, chatId });

  if (!rows) throw new Error("Can't get other user id");

  return rows[0];
};
