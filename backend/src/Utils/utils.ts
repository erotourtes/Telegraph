import jwt, { JwtPayload } from "jsonwebtoken";
import * as userService from "../services/userService.js";
import EventEmitter from "node:events";
import { WebSocket } from "ws";

type Fn = (...args: any[]) => void;

export const promisify =
  <T>(fn: Fn) =>
  (...args: any[]) =>
    new Promise<T>((res, rej) => {
      fn(...args, (err: Error | null, data: T) => {
        if (err) rej(err);
        res(data);
      });
    });

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface RequestWithParams<T> extends Express.Request {
  params: T;
}

export const getJWTToken = (id: number) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) throw new Error("JWT_SECRET is not set");
  if (!expiresIn) throw new Error("JWT_EXPIRES_IN is not set");

  const token = jwt.sign({ id }, secret, { expiresIn });
  return token;
};

export const verifyJWTToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return promisify<JwtPayload>(jwt.verify)(token, secret);
};

export const getExpiryJWTDate = () => {
  if (!process.env.JWT_EXPIRES_IN) throw new Error("JWT_EXPIRES_IN is not set");

  const expiresEnv = +process.env.JWT_EXPIRES_IN!.split("d")[0];
  const expires = new Date();
  expires.setDate(new Date().getDate() + expiresEnv);

  return expires;
};

export const parseCookies = (cookies: string) =>
  cookies.split(";").filter((v) => v).reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split("=");
      if (!key || !value) return acc;
      acc[key.trim()] = value.trim();
      return acc;
    },
    {} as { [key: string]: string },
  );

export const getUserFromJWT = async (token: string) => {
  const decoded = await verifyJWTToken(token).catch((err) => {
    console.log(err);

    return null;
  });

  if (!decoded) throw new Error("Invalid Token");

  const id = +decoded.id;

  const user = await userService.getUser({ id }).catch((err) => {
    console.log(err);

    return null;
  });

  if (!user) throw new Error("Invalid Token, maybe token is expired");

  return user;
};

export class EmitableWS<T> extends EventEmitter {
  // TODO: add types (message-sent, chat-created)
  private ws: WebSocket;
  private params: T;

  constructor(ws: WebSocket, user: T, typeName: string) {
    super();
    this.ws = ws;
    this.params = user;

    this.init(typeName);
  }

  init(typeName: string) {
    const { ws } = this;

    ws.on("message", (message) => {
      try {
        const json = JSON.parse(message.toString());
        this.emit(json.type, { ...json.data, [typeName]: this.params });
      } catch (err) {
        console.log(err);
      }
    });

    ws.on("close", () => {
      this.emit("close-ws", { [typeName]: this.params });
    });
  }
}
