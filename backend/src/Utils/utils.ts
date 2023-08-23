import jwt, { Jwt } from "jsonwebtoken";

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

  return promisify<Jwt>(jwt.verify)(token, secret);
};
