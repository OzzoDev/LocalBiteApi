import jwt from "jsonwebtoken";
import {
  IsLoggedInError,
  IsVerifiedError,
  SessionExpiredError,
  UnauthticatedError,
  AccountSuspensionError,
  UserNotFoundError,
  JwtVersionError,
  UnauthorhizedError,
} from "../errors/AuthErrors.js";
import { findUser, findUserById } from "../services/db/users.js";
import { findBusiness } from "../services/db/businesses.js";
import { NotOwnerError } from "../errors/BusinessOwnerError.js";
import { NotFoundError } from "../errors/RouteErrors.js";

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
      return next(new UserNotFoundError());
    }

    if (decoded.version !== user.jwt_version) {
      return next(new JwtVersionError());
    }

    if (user.is_suspended) {
      return next(new AccountSuspensionError());
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
      return next();
    }

    if (user.is_suspended) {
      next(new AccountSuspensionError());
    }

    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeBusinessOwner = async (req, _, next) => {
  const { businessid: businessId } = req.params;
  const { id: ownerId } = req.user;

  const user = await findUserById(ownerId);

  if (!["unverified_owner", "owner"].includes(user.role)) {
    return next(new UnauthorhizedError());
  }

  if (!businessId) {
    return next(new NotFoundError());
  }

  const business = await findBusiness(businessId);

  if (business.owner_id !== parseInt(ownerId, 10)) {
    return next(new NotOwnerError());
  }

  next();
};
