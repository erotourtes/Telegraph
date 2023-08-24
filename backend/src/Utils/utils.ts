import jwt, { JwtPayload } from "jsonwebtoken";

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
