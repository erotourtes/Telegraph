/* eslint-disable max-len */
import pool from "../sql/dbPool.js";
import {
  ChatDB,
  GetOtherUserIdQueryResult,
  MessageDB,
  UserDB,
} from "./types.js";

export const createUserQuery = async (arg: {
  username: string;
  firstName: string;
  secondName: string;
  email: string;
  password: string;
}) =>
  pool.query<UserDB[]>(
    `
INSERT INTO telegraph.users (
	  username,
    first_name,
    second_name,
    email, 
    password
)
VALUES (
  ?, 
  ?, 
  ?, 
  ?, 
  ?
);
`,
    [arg.username, arg.firstName, arg.secondName, arg.email, arg.password],
  );

export const getUserQuery = async (arg: { email: string; password: string }) =>
  pool.query<UserDB[]>(
    `
SELECT * FROM telegraph.users
WHERE email = ? AND password = ?;
`,

    [arg.email, arg.password],
  );

export const getUserByIdQuery = async (arg: { id: number }) =>
  pool.query<UserDB[]>(
    `
SELECT * FROM telegraph.users
WHERE user_id = ?;
`,
    [arg.id],
  );

export const getChatIdQuery = async (arg: {
  userId: number;
  username: string;
}) =>
  pool.query(
    `
WITH UserCTE AS (
    SELECT user_id FROM telegraph.users u WHERE u.username = ? 
)
SELECT chat_id FROM telegraph.chats c
WHERE (c.user_id1 = ? OR c.user_id2 = ?) AND (
		c.user_id1 = (SELECT user_id FROM UserCTE) OR c.user_id2 = (SELECT user_id FROM UserCTE)
    );
`,
    [arg.username, arg.userId, arg.userId],
  );

export const getChatMessagesQuery = async (arg: { chatId: number }) =>
  pool.query<(MessageDB & { username: string })[]>(
    `
SELECT 
  	user_id,
  	message_id,
    content,
    sent_at,
    chat_id,
    username
FROM telegraph.chat_messages m
JOIN telegraph.users USING(user_id)
WHERE chat_id = ?
ORDER BY sent_at ASC;
`,
    [arg.chatId],
  );

export const getAllUserChatsQuery = async (arg: { userId: number }) =>
  pool.query(
    `
SELECT * FROM telegraph.chats c
WHERE c.user_id1 = ? OR c.user_id2 = ?;
`,
    [arg.userId, arg.userId],
  );

export const isUserInChatQuery = async (arg: {
  userId: number;
  chatId: number;
}) =>
  pool.query(
    `
SELECT EXISTS(
    SELECT 1
    FROM telegraph.chats c
    WHERE (c.user_id1 = ? OR c.user_id2 = ?)
      AND c.chat_id = ?
) AS user_in_chat;
`,
    [arg.userId, arg.userId, arg.chatId],
  );

export const createChat = async (arg: {
  username1: string;
  userId: number;
  username2: string;
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `
CALL telegraph.CREATE_CHAT(?, ?, ?);
`,
      [arg.userId, arg.username1, arg.username2],
    );

    const result = await connection.query<ChatDB[]>(
      `
SELECT * FROM telegraph.chats c WHERE c.chat_id = LAST_INSERT_ID();
`,
    );

    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const addMessage = async (arg: {
  userId: number;
  chatId: number;
  content: string;
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `
INSERT INTO telegraph.chat_messages (
  user_id,
  chat_id,
  content
) VALUES (?, ?, ?);
`,
      [arg.userId, arg.chatId, arg.content],
    );

    const result = await connection.query<MessageDB[]>(
      `
SELECT 
  	user_id,
  	message_id,
    content,
    sent_at,
    chat_id,
    username
FROM telegraph.chat_messages m 
JOIN telegraph.users u USING(user_id)
WHERE m.message_id = LAST_INSERT_ID();
`,
      [],
    );

    await connection.commit();

    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const getOtherUserId = async (arg: { userId: number; chatId: number }) =>
  pool.query<GetOtherUserIdQueryResult[]>(
    `
SELECT IF(c.user_id1 = ?, c.user_id2, c.user_id1) AS user_id FROM telegraph.chats c WHERE c.chat_id = ?;
`,
    [arg.userId, arg.chatId],
  );
