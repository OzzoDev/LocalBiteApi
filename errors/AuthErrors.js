import { AppError } from "./AppError.js";

export class DuplicateUserError extends AppError {
  constructor(message = "Username or email already exists") {
    super(message, 400);
  }
}

export class UserNotFoundError extends AppError {
  constructor(message = "User not found") {
    super(message, 404);
  }
}

export class PasswordError extends AppError {
  constructor(message = "Incorrect password") {
    super(message, 400);
  }
}

export class SessionExpiredError extends AppError {
  constructor(message = "Your session has expired, log in to continue") {
    super(message, 403);
  }
}

export class UnauthticatedError extends AppError {
  constructor(message = "Unauthticated") {
    super(message, 401);
  }
}

export class LogOutError extends AppError {
  constructor(message = "Logout failed") {
    super(message, 400);
  }
}

export class OtpError extends AppError {
  constructor(message = "Verification code is incorrect") {
    super(message, 400);
  }
}
