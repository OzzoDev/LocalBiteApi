import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/postgres.js";

const users = [
  {
    username: "oscar",
    password: "$2b$10$QE7RNfvMQK5ODXmt0avZT.9QiuA3gxKY55biBqZNrm8T5P/ZpSo3W",
  },
];

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

  try {
    const logQuery = `SELECT * FROM users;`;
    const logResult = await pool.query(logQuery);

    console.table(logResult.rows);

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING id, username;
    `;

    const result = await pool.query(insertQuery, [username, hashedPassword]);

    const newUser = result.rows[0];

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
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const unhashedPassword = await bcrypt.compare(password, user.password);

    if (!unhashedPassword) {
      return res
        .status(400)
        .json({ message: "Incorrect password", success: false });
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
