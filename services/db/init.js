import pool from "../../config/postgres.js";
import { sanitizeValues } from "../../utils/utils.js";

export async function ensureUsersTable() {
  try {
    const tableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' NOT NULL,
        is_suspended BOOLEAN DEFAULT FALSE,
        otp VARCHAR(8) NOT NULL, 
        login_fails INT DEFAULT 0,
        jwt_version INT DEFAULT 0,
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

    console.log("✅ Unverified users table and indexes ensured.");
  } catch (err) {
    console.error("Error ensuring users table:", err);
  }
}

export async function ensureBusinessTable() {
  try {
    const tableQuery = `
      CREATE TABLE IF NOT EXISTS businesses (
        id BIGSERIAL PRIMARY KEY,
        owner_id INT NOT NULL, 
        business_name VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL, 
        city VARCHAR(100) NOT NULL, 
        address VARCHAR(255) NOT NULL, 
        zip_code VARCHAR(20) NOT NULL, 
        business_phone VARCHAR(15) NOT NULL,
        business_website VARCHAR(100),
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

    await executeQuery(tableQuery);

    console.log("✅ Business table table and indexes ensured.");
  } catch (err) {
    console.error("Error ensuring users table:", err);
  }
}

export const executeQuery = async (query, values = []) => {
  const sanitizedValues = sanitizeValues(values);
  const client = await pool.connect();

  try {
    const response = await client.query(query, sanitizedValues);
    return response.rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  } finally {
    client.release();
  }
};
