import bcrypt from "bcryptjs";
import { executeQuery } from "./init.js";
import {
  DuplicateUserError,
  IsAlreadyVerifiedError,
  OtpError,
  PasswordError,
  UserNotFoundError,
} from "../../errors/AuthErrors.js";
import { generateOTP } from "../../utils/codes.js";

export const addUser = async (userData) => {
  const { username, email, password } = userData;

  const isUniqueUser = await ensureUniqueUser(userData);

  if (!isUniqueUser) {
    throw new DuplicateUserError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();

  const query = `INSERT INTO unverified_users (username,email,password,otp) values ($1, $2, $3, $4) RETURNING id, username, email, otp`;
  const values = [username, email, hashedPassword, otp];

  const result = await executeQuery(query, values);

  return result[0];
};

export const verifyUser = async (userData) => {
  const { username, email, otp } = userData;

  const existingVerifiedUser = await findUser(userData);

  if (existingVerifiedUser) {
    throw new IsAlreadyVerifiedError();
  }

  const findUserQuery = `
    SELECT username, email, password, otp
    FROM unverified_users
    WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
  `;

  const userResult = await executeQuery(findUserQuery, [username, email]);

  if (userResult.length === 0) {
    throw new UserNotFoundError(
      "Account not found. Please check the username or email and try again."
    );
  }

  const {
    username: verifiedUsername,
    email: verifiedEmail,
    password,
    otp: storedOtp,
  } = userResult[0];

  if (storedOtp !== otp) {
    throw new OtpError();
  }

  const deleteQuery = `
    DELETE FROM unverified_users
    WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
    RETURNING username, email, password, otp
  `;

  await executeQuery(deleteQuery, [verifiedUsername, verifiedEmail]);

  const insertQuery = `
    INSERT INTO users (username, email, password, otp)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email
  `;

  const insertResult = await executeQuery(insertQuery, [
    verifiedUsername,
    verifiedEmail,
    password,
    storedOtp,
  ]);

  return insertResult[0];
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

const ensureUniqueUser = async (userData) => {
  const { username, email } = userData;

  const query = `
  SELECT * FROM (
    SELECT username, email FROM users
    UNION
    SELECT username, email FROM unverified_users
  ) AS combined_users
  WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
`;

  const result = await executeQuery(query, [username, email]);
  return result.length === 0;
};

const incrementLoginFails = async (userId) => {
  const query = `
    UPDATE users
    SET login_fails = login_fails + 1
    WHERE id = $1
    RETURNING login_fails
  `;

  const result = await executeQuery(query, [userId]);

  if (result.length === 0) {
    throw new UserNotFoundError();
  }

  return result[0].login_fails;
};

const resetLoginFails = async (userId) => {
  const query = `
    UPDATE users
    SET login_fails = 0
    WHERE id = $1
  `;

  const result = await executeQuery(query, [userId]);

  if (result.length === 0) {
    throw new UserNotFoundError();
  }

  return 0;
};
