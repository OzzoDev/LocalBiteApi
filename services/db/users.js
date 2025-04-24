import bcrypt from "bcryptjs";
import { executeQuery } from "./init.js";
import {
  DuplicateUserError,
  IsAlreadyVerifiedError,
  OtpError,
  PasswordError,
  UserNotFoundError,
  AccountSuspensionError,
  DeleteUserError,
} from "../../errors/AuthErrors.js";
import { generateOTP } from "../../utils/codes.js";
import { sendPasswordResetEmail, verifyEmail } from "../auth/email.js";

export const addUser = async (userData) => {
  const { username, email, password } = userData;

  const isUniqueUser = await ensureUniqueUser(userData);

  if (!isUniqueUser) {
    throw new DuplicateUserError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = generateOTP();

  const query = `INSERT INTO unverified_users (username,email,password,otp) VALUES ($1, $2, $3, $4) RETURNING id, username, email, otp`;
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
    SELECT id, username, email, password, otp
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
    id,
    username: verifiedUsername,
    email: verifiedEmail,
    password,
    otp: storedOtp,
  } = userResult[0];

  const updatedOtp = await updateOtp(id, "unverified_users");

  if (storedOtp !== otp) {
    await verifyEmail(verifiedEmail, verifiedUsername, updatedOtp);
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

  const userId = user.id;

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const failedLogins = await incrementLoginFails(userId);

    if (failedLogins > 5) {
      await suspendAccount(userId);
      throw new AccountSuspensionError();
    }

    throw new PasswordError();
  }

  await resetLoginFails(userId);

  const { password: _, ...authenticatedUser } = user;
  return authenticatedUser;
};

export const updatePassword = async (userData) => {
  const { password, otp } = userData;

  const user = await findUser(userData);

  if (!user) {
    throw new UserNotFoundError();
  }

  const userId = user.id;

  const updatedOtp = await updateOtp(userId);

  if (user.otp !== otp) {
    await sendPasswordResetEmail(user.email, user.username, updatedOtp);
    throw new OtpError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    UPDATE users
    SET password = $2
    WHERE id = $1
    RETURNING id
  `;

  const result = await executeQuery(query, [user.id, hashedPassword]);

  await resetLoginFails(userId);
  await unsuspendAccount(userId);

  return result.length !== 0;
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

export const invalidateTokens = async (userId) => {
  const query = `
    UPDATE users
    SET jwt_version = jwt_version + 1
    WHERE id = $1
    RETURNING jwt_version
  `;

  const result = await executeQuery(query, [userId]);

  if (result.length === 0) {
    throw new UserNotFoundError();
  }

  return result[0].jwt_version;
};

export const deleteUser = async (userId, deleteCommand = "") => {
  const findQuery = `
    SELECT username
    FROM users
    WHERE id = $1
  `;

  const findResult = await executeQuery(findQuery, [userId]);

  if (findResult.length === 0) {
    throw new UserNotFoundError();
  }

  const username = findResult[0].username;
  const [key, commandUsername] = deleteCommand.split(" ");

  if (key.toLowerCase() !== "delete" || commandUsername.toLowerCase() !== username.toLowerCase()) {
    throw new DeleteUserError();
  }

  const deleteQuery = `
    DELETE FROM users
    WHERE id = $1
  `;

  await executeQuery(deleteQuery, [userId]);
};

const updateOtp = async (userId, table = "users") => {
  const query = `
    UPDATE ${table}
    SET otp = $2
    WHERE id = $1
    RETURNING otp
  `;
  const result = await executeQuery(query, [userId, generateOTP()]);

  if (result.length === 0) {
    throw new UserNotFoundError();
  }

  return result[0].otp;
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

  return await executeQuery(query, [userId]);
};

const suspendAccount = async (userId) => {
  const query = `
    UPDATE users
    SET is_suspended = true
    WHERE id = $1
  `;

  return await executeQuery(query, [userId]);
};

const unsuspendAccount = async (userId) => {
  const query = `
    UPDATE users
    SET is_suspended = false
    WHERE id = $1
  `;

  return await executeQuery(query, [userId]);
};
