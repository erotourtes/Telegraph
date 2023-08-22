import express, { Express, Request, Response } from "express";
import userRouter from "./routes/userRoutes.js";

const app: Express = express();

app.use(express.json({ limit: "10kb" }));


app.use("/api/v1/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server!!!!");
});

export default app;
