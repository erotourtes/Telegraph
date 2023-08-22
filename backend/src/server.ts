import dotenv from "dotenv";
import app from "./app.js";
import mysql from "mysql2";

dotenv.config();


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


connection.connect((err) => {
  if (err) throw err;

  console.log("Connected!");
});

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

  connection.end(() => {
    console.log("Database connection closed!");
  });
});
