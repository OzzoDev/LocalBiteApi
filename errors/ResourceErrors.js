import { AppError } from "./AppError.js";

export class DishNotFoundError extends AppError {
  constructor(message = "Dish not found") {
    super(message, 404);
  }
}

export class LocationNotFoundError extends AppError {
  constructor(message = "Location not found") {
    super(message, 404);
  }
}

export class MenuNotFoundError extends AppError {
  constructor(message = "Menu not found") {
    super(message, 404);
  }
}
