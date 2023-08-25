import jwt, { JwtPayload } from "jsonwebtoken";
import * as userService from "../services/userService.js";
import EventEmitter from "node:events";
import { WebSocket } from "ws";
import { UserDB } from "../sql/types.js";

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
  cookies.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split("=");
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

export class EmitableWS extends EventEmitter {
  // TODO: add types (message-sent, chat-created)
  private ws: WebSocket;
  private user: UserDB;

  constructor(ws: WebSocket, user: UserDB) {
    super();
    this.ws = ws;
    this.user = user;

    this.init();
  }

  init() {
    const { ws } = this;

    ws.on("message", (message) => {
      try {
        const json = JSON.parse(message.toString());
        this.emit(json.type, { ...json.data, user: this.user });
      } catch (err) {
        console.log(err);
      }
    });
  }
}
