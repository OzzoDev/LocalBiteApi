import {
  addUser,
  performLogin,
  verifyUser,
  updatePassword,
  findUser,
  deleteUser,
} from "../services/db/users.js";
import { DeleteUserError, LogOutError, UserNotFoundError } from "../errors/AuthErrors.js";
import { signAndStroreJwt } from "../services/auth/jwt.js";
import { verifyEmail, sendPasswordResetEmail } from "../services/auth/email.js";
import { resetLoginRateLimit, resetPasswordResetRateLimit } from "../middlewares/RateLimiters.js";

const isProd = process.env.NODE_ENV === "production";

export const signup = async (req, res, next) => {
  try {
    const newUser = await addUser(req.body);

    const { email, username, otp } = newUser;

    await verifyEmail(email, username, otp);

    const { otp: _, ...safeUserData } = newUser;

    res.status(201).json({
      user: safeUserData,
      message: "Account pending verification",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await performLogin(req.body);

    await signAndStroreJwt(user, req);

    resetPasswordResetRateLimit(req.ip);

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const verify = async (req, res, next) => {
  try {
    const user = await verifyUser(req.body);

    await signAndStroreJwt(user, req);

    res.status(201).json({
      user,
      message: "Account verified successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const requestPasswordResetOtp = async (req, res, next) => {
  const { identifer } = req.params;

  try {
    const user = await findUser({ username: identifer, email: identifer });

    if (!user) {
      throw new UserNotFoundError();
    }

    await sendPasswordResetEmail(user.email, user.username, user.otp);

    res
      .status(200)
      .json({ message: "Verification code to reset password sent successfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const userData = req.body;

  try {
    await updatePassword(userData);

    await signAndStroreJwt(userData, req);
    resetLoginRateLimit(req.ip);

    res.status(200).json({ message: "Password resetted successfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const signout = (req, res) => {
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict",
  });

  req.session.destroy((err) => {
    if (err) {
      throw new LogOutError();
    }
    res.status(200).json({ message: "Logged out successfully", success: true });
  });
};

export const deleteAccount = async (req, res, next) => {
  const { deletecommand: deleteCommand } = req.params;
  const { id: userId } = req.user;

  try {
    await deleteUser(userId, deleteCommand);

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: isProd,
      sameSite: "Strict",
    });

    req.session.destroy((err) => {
      if (err) {
        throw new DeleteUserError();
      }
      res.status(200).json({ message: "Account deleted successfully", success: true });
    });
  } catch (err) {
    next(err);
  }
};
