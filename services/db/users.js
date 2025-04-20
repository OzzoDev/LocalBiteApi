import bcrypt from "bcryptjs";
import { executeQuery } from "./init.js";

export const addUser = async (userData) => {
  const { username, email, password } = userData;

  const isUniqueUser = await ensureUniqueUser(userData);

  if (!isUniqueUser) {
    throw new Error("Username or email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (username,email,password) values ($1, $2, $3) RETURNING *`;
  const values = [username, email, hashedPassword];

  const result = await executeQuery(query, values);

  const { password: _, ...newUser } = result[0];

  return newUser;
};

export const ensureUniqueUser = async (userData) => {
  const { username, email } = userData;

  const query = `
    SELECT * FROM users
    WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
  `;
  const existingUser = await executeQuery(query, [username, email]);

  return existingUser.length === 0;
};
