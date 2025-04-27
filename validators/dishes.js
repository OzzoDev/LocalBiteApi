import { z } from "zod";
import { RequestBodyValidationError } from "../errors/ValidationErrors.js";

const dishSchema = z
  .object({
    dishName: z
      .string({ message: "Dish name must not be empty" })
      .nonempty({ message: "Dish name must not be empty" })
      .min(3, { message: "Dish name must be at least 3 characters long" })
      .max(100, { message: "Dish name cannot be longer than 100 characters" }),
    description: z
      .string({ message: "Description must not be empty" })
      .nonempty({ message: "Description must not be empty" })
      .min(10, { message: "Description must be at least 10 characters long" })
      .max(300, { message: "Description cannot be longer than 300 characters" }),
    price: z
      .number({ message: "Price must be a number" })
      .positive({ message: "Price must be greater than 0" }),
  })
  .strict();

const dishUpdateSchema = z
  .object({
    dishName: z
      .string({ message: "Dish name must not be empty" })
      .min(3, { message: "Dish name must be at least 3 characters long" })
      .max(100, { message: "Dish name cannot be longer than 100 characters" })
      .optional(),
    description: z
      .string({ message: "Description must not be empty" })
      .min(10, { message: "Description must be at least 10 characters long" })
      .max(300, { message: "Description cannot be longer than 300 characters" })
      .optional(),
    price: z
      .number({ message: "Price must be a number" })
      .positive({ message: "Price must be greater than 0" })
      .optional(),
  })
  .strict();

export const validateDishBody = (req, _, next) => {
  try {
    dishSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(
        new RequestBodyValidationError(err.errors.map((error) => error.message).join(", "))
      );
    }

    next(err);
  }
};

export const validateDishUpdateBody = (req, _, next) => {
  try {
    dishUpdateSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(
        new RequestBodyValidationError(err.errors.map((error) => error.message).join(", "))
      );
    }

    next(err);
  }
};
