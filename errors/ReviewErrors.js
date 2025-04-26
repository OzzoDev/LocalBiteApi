import { AppError } from "./AppError.js";

export class ReviewNotFoundError extends AppError {
  constructor(message = "Review not found") {
    super(message, 404);
  }
}

export class NotUserReview extends AppError {
  constructor(message = "You did not place this review") {
    super(message, 401);
  }
}
