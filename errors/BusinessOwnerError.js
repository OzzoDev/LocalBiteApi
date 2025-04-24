import { AppError } from "./AppError.js";

export class BusinessNotFoundError extends AppError {
  constructor(message = "Business not found") {
    super(message, 404);
  }
}

export class DishNotFoundError extends AppError {
  constructor(message = "Dish not found") {
    super(message, 404);
  }
}

export class NotOwnerError extends AppError {
  constructor(message = "You do not have the right permissions") {
    super(message, 401);
  }
}

export class UpdateError extends AppError {
  constructor(message = "No fields provided for update") {
    super(message, 401);
  }
}
