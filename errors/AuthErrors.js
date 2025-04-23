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

export class AccountSuspensionError extends AppError {
  constructor(message = "Account has been locked, reset password to regain access") {
    super(message, 401);
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
  constructor(message = "Verification code is incorrect, a new one will be issued to your email") {
    super(message, 400);
  }
}

export class IsVerifiedError extends AppError {
  constructor(message = "Unverified") {
    super(message, 401);
  }
}

export class IsAlreadyVerifiedError extends AppError {
  constructor(message = "Your account has already been verified") {
    super(message, 400);
  }
}

export class EmailError extends AppError {
  constructor(message = "Error sending email") {
    super(message, 500);
  }
}

export class IsLoggedInError extends AppError {
  constructor(message = "You cannot be logged in to perform this action") {
    super(message, 400);
  }
}

export class TooManyLoginsError extends AppError {
  constructor(message = "Too many login attempts, try again in 5 minutes") {
    super(message, 429);
  }
}

export class TooPasswordResetAttemptsError extends AppError {
  constructor(message = "Too many attempts to reset password, try again in 5 minutes") {
    super(message, 429);
  }
}

export class JwtVersionError extends AppError {
  constructor(message = "Token has been invalidated") {
    super(message, 401);
  }
}
