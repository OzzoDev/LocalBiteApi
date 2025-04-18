import pg from "pg";

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function main() {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT NOW()");
    console.log(response.rows);
    const { rows } = response;
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

main()
  .then(() => console.log("Connected to Postgres"))
  .catch((err) => console.error("Error connecting to Postgres", err));

export default pool;
