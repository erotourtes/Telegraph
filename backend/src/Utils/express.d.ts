import { UserDB } from "../sql/types.ts";
declare global {
  namespace Express {
    export interface Request {
      user: UserDB;
    }
  }
}

// declare namespace Express {
//   export interface Request {
//     user: import("../sql/types.ts").UserDB;
//   }
// }
