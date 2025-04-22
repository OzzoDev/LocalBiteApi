import rateLimit from "express-rate-limit";
import { TooManyLoginsError, TooPasswordResetAttemptsError } from "../errors/AuthErrors.js";

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 4,
  handler: (req, res, next) => {
    next(new TooManyLoginsError());
  },
});

export const resetPasswordRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 4,
  handler: (req, res, next) => {
    next(new TooPasswordResetAttemptsError());
  },
});
