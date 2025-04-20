import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { addUser } from "../services/db/users.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  try {
    const newUser = await addUser(req.body);

    const jwtToken = jwt.sign({ username: newUser.username }, JWT_SECRET, {
      expiresIn: "1y",
    });

    req.session.jwt = jwtToken;

    res.status(201).json({
      user: newUser,
      message: "Account registered successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const unhashedPassword = await bcrypt.compare(password, user.password);

    if (!unhashedPassword) {
      return res.status(400).json({ message: "Incorrect password", success: false });
    }

    console.log(`User ${user.username} signed in`);

    const jwtToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1y" });

    req.session.jwt = jwtToken;

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const signout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", success: false });
    }
    res.status(200).json({ message: "Logged out successfully", success: true });
  });
};
