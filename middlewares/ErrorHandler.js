import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/RouteErrors.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  console.log(err);

  res.status(500).json({ message: "Internal server error", success: false });
};

export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
