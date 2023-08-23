import { RowDataPacket } from "mysql2/promise";

export interface User extends RowDataPacket {
  email: string;
  password: string;
  username: string;
  firstName: string;
  secondName: string;
}

export interface UserDB extends RowDataPacket {
  user_id: number;
  email: string;
  password: string;
  username: string;
  first_name: string;
  second_name: string;
}
