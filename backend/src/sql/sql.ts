import pool from "../sql/dbPool.js";
import { UserWithId } from "./types.js";

export const createUserQuery = async (arg: {
  username: string;
  firstName: string;
  secondName: string;
  email: string;
  password: string;
}) =>
  pool.query<UserWithId[]>(
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
`, [arg.username, arg.firstName, arg.secondName, arg.email, arg.password]);

export const getUserQuery = async (arg: {
  email: string;
  password: string;
}) =>
  pool.query<UserWithId[]>(
    `
SELECT * FROM telegraph.users
WHERE email = ? AND password = ?;
`,

    [arg.email, arg.password],
  );
