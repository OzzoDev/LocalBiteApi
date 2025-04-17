import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  const jwtToken = req.session.jwt;

  if (!jwtToken) {
    return res.status(401).json({ message: "Unauthticated", success: false });
  }

  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthticated", success: false });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        message: "Your session has expired, log in to continue",
        success: false,
      });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
