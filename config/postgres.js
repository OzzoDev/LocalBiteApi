import pg from "pg";
import { ensureUnVerifiedUsersTable, ensureUsersTable } from "../services/db/init.js";

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to Postgres");
    client.release();
    await ensureUsersTable();
    await ensureUnVerifiedUsersTable();
  } catch (err) {
    console.error("❌ Error connecting to Postgres", err);
  }
})();

export default pool;
