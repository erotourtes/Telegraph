import * as query from "../sql/sql.js";
import { User, UserDB } from "../sql/types.js";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log("login: fethcing user", email, password);
  const [rows] = await query.getUserQuery({ email, password });

  if (rows.length === 0) throw new Error("User is not found");

  return rows[0] as UserDB;
};

export const signup = async (user: User) => {
  const [rows] = await query
    .createUserQuery(user)
    .then((res) => query.getUserQuery(user));

  return rows[0] as UserDB;
};

export const getUser = async ({ id }: { id: number }) => {
  const [rows] = await query.getUserByIdQuery({ id });

  if (rows.length === 0) throw new Error("User is not found");

  return rows[0] as UserDB;
};
