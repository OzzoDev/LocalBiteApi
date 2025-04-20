import pool from "../../config/postgres.js";

export async function ensureUsersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await executeQuery(query);
    console.log("✅ Users table ensured.");
  } catch (err) {
    console.error("Error ensuring users table:", err);
  }
}

export const executeQuery = async (query, values = []) => {
  const client = await pool.connect();
  try {
    const response = await client.query(query, values);
    return response.rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  } finally {
    client.release();
  }
};
