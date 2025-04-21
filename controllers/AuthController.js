import { addUser, performLogin, verifyUser } from "../services/db/users.js";
import { LogOutError } from "../errors/AuthErrors.js";
import { setJwt } from "../services/auth/jwt.js";

export const signup = async (req, res, next) => {
  try {
    const newUser = await addUser(req.body);

    setJwt({ username: newUser.username }, req);

    res.status(201).json({
      user: newUser,
      message: "Account registered successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await performLogin(req.body);

    setJwt({ username: user.username }, req);

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
