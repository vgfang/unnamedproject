import knex from "knex";
import fs from "fs";
import path from "path";

// Initialize Knex with PostgreSQL configuration
const db = knex({
  client: "pg",
  connection: {
    host: "postgres",
    user: "postgres",
    password: "password",
    database: "database",
    port: 5432,
  },
  pool: { min: 2, max: 10 },
});

// Load SQL initialization script
const initSql = fs.readFileSync(path.join(__dirname, "./init.sql")).toString();

(async () => {
  try {
    // attempt a test connection to ensure connectivity
    await db.raw("SELECT 1");
    console.log("Connected to database");
    // run the initialization script
    await db.raw(initSql);
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database", error);
  }
})();

export default db;
