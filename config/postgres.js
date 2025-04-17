import pkg from "pg";
const { Pool } = pkg;

const POSTGRES_URL = process.env.POSTGRES_URL;

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL DB connected!");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    await pool.query(createTableQuery);
    console.log("✅ 'users' table ensured.");
  } catch (err) {
    console.error("❌ PostgreSQL setup error:", err.message);
  }
})();

export default pool;
