import express, { Express, Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoute.js";
import cookieParser from "cookie-parser";

const app: Express = express();

const corsOptions = {
  origin: (origin: any, cb: any) => {
    const whitelist = process.env.CLIENT_URL?.split(";") || [];
    if (whitelist.indexOf(origin) !== -1) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server!!!!");
});

export default app;
