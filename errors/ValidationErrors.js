import { AppError } from "./AppError.js";

export class RequestBodyValidationError extends AppError {
  constructor(message = "Request body validation failed") {
    super(message, 400);
  }
}
