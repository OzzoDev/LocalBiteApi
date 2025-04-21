import { AppError } from "../errors/AppError.js";

export const errorHandler = (err, _, res) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  res.status(500).json({ message: "Internal server error", success: false });
};
