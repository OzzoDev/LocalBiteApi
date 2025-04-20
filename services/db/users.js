import { executeQuery } from "./init";

export const addUser = async (userData) => {
  const { username, email, password } = userData;
  const query = `INSERT INTO users (username,email,password) values ($1, $2, $3) RETURNING *`;
  const values = [username, email, password];

  const result = await executeQuery(query, values);
  return result[0];
};
