import "./Utils/env.js";
import app from "./app.js";
import pool from "./sql/dbPool.js";
import { promisify } from "./Utils/utils.js";
import { WebSocketServer } from "ws";
import http from "http";
import { onConnect } from "./ws/connection.js";

const PORT = process.env.PORT;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on("connection", onConnect);

server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down...");

  const promises = Promise.all([
    promisify<void>(server.close)().then(() => console.log("Server closed!")),
    pool.end().then(() => console.log("Database connection closed!")),
  ]);

  promises.then(() => process.exit(1));
});
