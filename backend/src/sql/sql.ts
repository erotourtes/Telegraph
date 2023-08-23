import pool from "../sql/dbPool.js";
import { UserDB } from "./types.js";

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
WHERE id = ?;
`,
    [arg.id],
  );

export const getChatMessagesQuery = async (arg: { chatId: number }) =>
  pool.query(
    `
SELECT * FROM telegraph.chat_messages
WHERE chat_id = ?;
`,
    [arg.chatId],
  );
