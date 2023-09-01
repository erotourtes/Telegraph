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

export interface MessageDB extends RowDataPacket {
  message_id: number;
  content: string;
  chat_id: number;
  user_id: number;
  sent_at: string;
}

export interface ChatDB extends RowDataPacket {
  chat_id: number;
  user_id1: number;
  user_id2: number;
  created_at: string;
  name: string;
}

export interface GetOtherUserIdQueryResult extends RowDataPacket {
  user_id: number;
}
