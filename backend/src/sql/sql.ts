/* eslint-disable max-len */
import pool from "../sql/dbPool.js";
import { ChatDB, UserDB } from "./types.js";

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
  pool.query(
    `
SELECT * FROM telegraph.chat_messages m
WHERE m.chat_id = ?;
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
