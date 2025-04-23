import rateLimit, { MemoryStore } from "express-rate-limit";
import { TooManyLoginsError, TooPasswordResetAttemptsError } from "../errors/AuthErrors.js";

const loginRateLimiterStore = new MemoryStore();
const resetPasswordRateLimiterStore = new MemoryStore();

export const resetLoginRateLimit = (key) => loginRateLimiterStore.resetKey(key);
export const resetPasswordResetRateLimit = (key) => resetPasswordRateLimiterStore.resetKey(key);

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 4,
  keyGenerator: (req) => req.ip,
  handler: (req, res, next) => {
    next(new TooManyLoginsError());
  },
  store: loginRateLimiterStore,
});

export const resetPasswordRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 4,
  keyGenerator: (req) => req.ip,
  handler: (req, res, next) => {
    next(new TooPasswordResetAttemptsError());
  },
  store: resetPasswordRateLimiterStore,
});
