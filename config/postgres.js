import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: "5432",
});

const createUserTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );`;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Table "users" created or already exists.');
    client.release();
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createUserTable()
  .then(() => {
    console.log("Postgres Initialization");
  })
  .catch((error) => {
    console.error("Initialization error:", error);
  });
