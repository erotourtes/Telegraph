import { RowDataPacket } from "mysql2/promise";

export interface User extends RowDataPacket {
  email: string;
  password: string;
  username: string;
  firstName: string;
  secondName: string;
}

export interface UserWithId extends User {
  id: number;
}
