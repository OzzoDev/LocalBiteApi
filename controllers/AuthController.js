import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const users = [];

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    console.log(users);

    const jwtToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1y" });

    req.session.jwt = jwtToken;

    res.status(201).json({
      users,
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
