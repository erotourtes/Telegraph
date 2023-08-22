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
