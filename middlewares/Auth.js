import jwt from "jsonwebtoken";
import {
  IsLoggedInError,
  IsVerifiedError,
  SessionExpiredError,
  UnauthticatedError,
  AccountSuspensionError,
} from "../errors/AuthErrors.js";
import { findUser } from "../services/db/users.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, _, next) => {
  const token = req.session.jwt;

  if (!token) {
    return next(new UnauthticatedError());
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return next(new UnauthticatedError());
    }

    const user = await findUser(decoded);

    if (!user) {
      next(new UserNotFoundError());
    }

    if (user.is_suspended) {
      next(new AccountSuspensionError());
    }

    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new SessionExpiredError());
    }

    next(err);
  }
};

export const ensureIsVerified = async (req, _, next) => {
  try {
    const userData = req.user;

    if (!userData) {
      return next(new UnauthticatedError());
    }

    const user = await findUser(userData);

    if (!user) {
      return next(new IsVerifiedError());
    }

    next();
  } catch (err) {
    next(err);
  }
};

export const ensureNotLoggedIn = (req, _, next) => {
  const isLoggedIn = !!req.session.jwt;

  if (isLoggedIn) {
    return next(new IsLoggedInError());
  }

  next();
};

export const ensureNotSuspended = async (req, _, next) => {
  try {
    const user = await findUser(req.body);

    if (!user) {
      next();
    }

    if (user.is_suspended) {
      next(new AccountSuspensionError());
    }

    next();
  } catch (err) {
    next(err);
  }
};
