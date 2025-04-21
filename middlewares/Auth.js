import jwt from "jsonwebtoken";
import { SessionExpiredError, UnauthticatedError } from "../errors/AuthErrors";

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

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new SessionExpiredError();
    }

    next(error);
  }
};
