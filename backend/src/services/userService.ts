import { TypedRequestBody } from "../Utils/utils.js";
import * as query from "../sql/sql.js";
import { User, UserWithId } from "../sql/types.js";

export const login = async (
  req: TypedRequestBody<{ email: string; password: string }>,
) => {
  const [rows] = await query.getUserQuery(req.body);

  if (rows.length === 0) throw new Error("User not found");

  return rows[0] as UserWithId;
};

export const signup = async (req: TypedRequestBody<User>) => {
  const body = req.body;
  const [rows] = await query
    .createUserQuery(body)
    .then((res) => query.getUserQuery(body));

  return rows[0] as UserWithId;
};
