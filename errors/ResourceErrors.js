import { AppError } from "./AppError.js";

export class DishNotFoundError extends AppError {
  constructor(message = "Dish not found") {
    super(message, 404);
  }
}
