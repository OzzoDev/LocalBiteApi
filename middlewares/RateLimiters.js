import rateLimit from "express-rate-limit";
import { TooManyLoginsError } from "../errors/AuthErrors";

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 4,
  handler: (req, res, next) => {
    next(new TooManyLoginsError());
  },
});
