import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
  waitForConnections: true,
  idleTimeout: 60000,
});

export default pool;
