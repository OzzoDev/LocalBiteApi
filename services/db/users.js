import bcrypt from "bcryptjs";
import { executeQuery } from "./init.js";
import { DuplicateUserError, PasswordError, UserNotFoundError } from "../../errors/AuthErrors.js";

export const addUser = async (userData) => {
  const { username, email, password } = userData;

  const isUniqueUser = await ensureUniqueUser(userData);

  if (!isUniqueUser) {
    throw new DuplicateUserError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (username,email,password) values ($1, $2, $3) RETURNING username, email`;
  const values = [username, email, hashedPassword];

  const result = await executeQuery(query, values);

  return result[0];
};

export const performLogin = async (userData) => {
  const { password } = userData;

  const user = await findUser(userData);

  if (!user) {
    throw new UserNotFoundError();
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new PasswordError();
  }

  const { password: _, ...authenticatedUser } = user;
  return authenticatedUser;
};

export const findUser = async (userData) => {
  const { username, email } = userData;

  const query = `
    SELECT * FROM users
    WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
  `;

  const result = await executeQuery(query, [username, email]);
  return result[0];
};

export const ensureUniqueUser = async (userData) => {
  const user = await findUser(userData);
  return !user;
};
