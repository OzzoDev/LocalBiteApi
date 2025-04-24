import pg from "pg";
import {
  ensureBusinessTable,
  ensureUnVerifiedUsersTable,
  ensureUsersTable,
} from "../services/db/init.js";

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

    await Promise.all([ensureUsersTable(), ensureUnVerifiedUsersTable(), ensureBusinessTable()]);

    console.log("✅ All tables ensured successfully");
  } catch (err) {
    console.error("❌ Error connecting to Postgres", err);
  }
})();

export default pool;
