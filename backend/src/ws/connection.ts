import { IncomingMessage } from "http";
import { UserDB } from "../sql/types.js";
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

  "chat-created": async (msg: any) => {
    // const { chat_id, user_id, user } = msg;
    console.log("chat-created", msg);
  },
};

export const onConnect = async (
  ws: WebSocket,
  req: IncomingMessage & { user: UserDB },
) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const user = cookies.jwt ? await getUserFromJWT(cookies.jwt) : null;

  if (!user) throw new Error("User is not defined in websocket connection");

  const emitableWS = new EmitableWS(ws, user);

  connections.set(user.user_id, ws);

  Object.entries(onMessage).forEach(([event, handler]) =>
    emitableWS.on(event, handler),
  );
};
