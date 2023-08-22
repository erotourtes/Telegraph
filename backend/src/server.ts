import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down...");
  server.close(() => {
    console.log("Server closed!");
    process.exit(1);
  });
});
