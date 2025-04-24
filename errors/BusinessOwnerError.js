import { AppError } from "./AppError.js";

export class BusinessNotFoundError extends AppError {
  constructor(message = "Business not found") {
    super(message, 404);
  }
}
