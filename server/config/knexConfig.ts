import { Pool } from "pg";
import fs from "fs";
import path from "path";

const db = new Pool({
  user: "postgres",
  host: "postgres",
  database: "database",
  password: "password",
  port: 5432,
});

const initSql = fs.readFileSync(path.join(__dirname, "./init.sql")).toString();

(async () => {
  try {
    await db.query(initSql);
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database", error);
  }
})();

export default db;
