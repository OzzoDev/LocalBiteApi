import pool from "../../config/postgres.js";

export async function ensureUsersTable() {
  try {
    const tableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_suspended BOOLEAN DEFAULT FALSE,
        otp VARCHAR(8) NOT NULL, 
        login_fails INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const usernameIndex = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username));
    `;

    const emailIndex = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
    `;

    await executeQuery(tableQuery);
    await executeQuery(usernameIndex);
    await executeQuery(emailIndex);

    console.log("✅ Users table and indexes ensured.");
  } catch (err) {
    console.error("Error ensuring users table:", err);
  }
}

export async function ensureUnVerifiedUsersTable() {
  try {
    const tableQuery = `
      CREATE TABLE IF NOT EXISTS unverified_users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        otp VARCHAR(8) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    const usernameIndex = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_unverified_users_username_lower ON users (LOWER(username));
    `;

    const emailIndex = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_unverified_users_email_lower ON users (LOWER(email));
    `;

    await executeQuery(tableQuery);
    await executeQuery(usernameIndex);
    await executeQuery(emailIndex);

    // await executeQuery("DROP TABLE unverified_users");
    // await executeQuery("DROP TABLE users");

    console.log("✅ Unverified users table and indexes ensured.");
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
