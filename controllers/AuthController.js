import { addUser, performLogin, verifyUser } from "../services/db/users.js";
import { LogOutError } from "../errors/AuthErrors.js";
import { setJwt } from "../services/auth/jwt.js";
import { verifyEmail } from "../services/auth/email.js";

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
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
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
