import { IncomingMessage } from "http";
import { ChatDB, UserDB } from "../sql/types.js";
import { EmitableWS, getUserFromJWT, parseCookies } from "../Utils/utils.js";
import { WebSocket } from "ws";
import * as chatService from "../services/chatService.js";

const connections = new Map<number, WebSocket>();

const onMessage = {
  "message-sent": async (args: {
    content: string;
    chatId: number;
    user: UserDB;
  }) => {
    const message = await chatService
      .addMessage({
        chatId: args.chatId,
        content: args.content,
        userId: args.user.user_id,
      })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!message) return;

    const { user_id: userId } = await chatService.getOtherUserId({
      userId: args.user.user_id,
      chatId: args.chatId,
    });

    // TODO: remove notify yourself
    const users = [args.user.user_id, userId];
    users.forEach(
      (userId) =>
        connections.get(userId)?.send(
          JSON.stringify({
            type: "message-notify",
            data: { message },
          }),
        ),
    );
  },

  "chat-created": async (
    args: ChatDB & { user: UserDB }, // user who created the chat
  ) => {
    const otherUserId =
      args.user_id1 === args.user.user_id ? args.user_id2 : args.user_id1;

    const otherUserWS = connections.get(otherUserId);
    if (!otherUserWS) return;

    const chat: ChatDB = { ...args };
    otherUserWS.send(
      JSON.stringify({
        type: "chat-notify",
        data: {
          chat,
        },
      }),
    );
  },
  "close-ws": async (msg: any) => {
    console.log("connection ws is closed", msg);
    connections.delete(msg.user.user_id);
  },
};

export const onConnect = async (
  ws: WebSocket,
  req: IncomingMessage & { user: UserDB },
) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const user = cookies.jwt ? await getUserFromJWT(cookies.jwt) : null;

  if (!user) {
    console.log("User is not defined in websocket connection");
    return;
  }

  const emitableWS = new EmitableWS<UserDB>(ws, user, "user");

  connections.set(user.user_id, ws);

  Object.entries(onMessage).forEach(([event, handler]) =>
    emitableWS.on(event, handler),
  );
};
