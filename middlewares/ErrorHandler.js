import { AppError } from "../errors/AppError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  res.status(500).json({ message: "Internal server error", success: false });
};
