import { addUser, performLogin, verifyUser, updatePassword } from "../services/db/users.js";
import { LogOutError, UserNotFoundError } from "../errors/AuthErrors.js";
import { setJwt } from "../services/auth/jwt.js";
import { verifyEmail, sendPasswordResetEmail } from "../services/auth/email.js";

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

    setJwt(user, req);

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

    setJwt(user, req);

    res.status(201).json({
      user,
      message: "Account verified successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const signout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new LogOutError();
    }
    res.status(200).json({ message: "Logged out successfully", success: true });
  });
};

export const requestPasswordResetOtp = async (req, res, next) => {
  try {
    const user = await findUser(req.params);

    if (!user) {
      throw new UserNotFoundError();
    }

    await sendPasswordResetEmail(user.email, user.username, user.otp);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const userData = req.body;

  try {
    const resettedSuccessfully = await updatePassword(userData);

    if (resettedSuccessfully) {
      setJwt(userData, req);
    }
  } catch (err) {
    next(err);
  }
};
