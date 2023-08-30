export interface ChatI {
  chat_id: number;
  name: string;
  created_at: string;
  user_id1: number;
  user_id2: number;
}

export interface UserI {
  email: string;
  password: string;
  username: string;
  firstName: string;
  secondName: string;
}

export interface UserDBI extends UserI {
  user_id: number;
}

export interface MessageI {
  message_id: number;
  chat_id: number;
  user_id: number;
  content: string;
  sent_at: string;
}

export interface MessageWithUserI extends MessageI {
  username: string;
}
