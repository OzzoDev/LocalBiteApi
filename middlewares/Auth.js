import jwt from "jsonwebtoken";
import { IsVerifiedError, SessionExpiredError, UnauthticatedError } from "../errors/AuthErrors.js";
import { findUser } from "../services/db/users.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, _, next) => {
  const jwtToken = req.session.jwt;

  if (!jwtToken) {
    throw new UnauthticatedError();
  }

  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET);

    if (!decoded) {
      throw new UnauthticatedError();
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
