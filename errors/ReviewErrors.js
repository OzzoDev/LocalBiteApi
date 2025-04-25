import { AppError } from "./AppError.js";

export class ReviewNotFoundError extends AppError {
  constructor(message = "Review not found") {
    super(404, message);
  }
}

export class NotUserReview extends AppError {
  constructor(message = "Review not found") {
    super(404, message);
  }
}
