import { readFile } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Copy .env.example to .env and enter your PostgreSQL connection string.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "false" || process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

try {
  const sql = await readFile(new URL("../postgres/schema.sql", import.meta.url), "utf8");
  await pool.query(sql);
  console.log("PostgreSQL schema and demo accounts are ready.");
} finally {
  await pool.end();
}
