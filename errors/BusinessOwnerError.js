import { AppError } from "./AppError.js";

export class BusinessEmailError extends AppError {
  constructor(
    message = "The email address provided does not appear to be associated with the specified business. Please ensure you are using an email that matches your business domain."
  ) {
    super(message, 400);
  }
}
