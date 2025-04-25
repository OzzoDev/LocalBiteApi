import { z } from "zod";
import { RequestBodyValidationError } from "../errors/ValidationErrors";

const businessReviewSchema = z
  .object({
    rating: z
      .number({ message: "Rating must be a number" })
      .min(1, { message: "Rating must be greater or equal to 1" })
      .max(10, { message: "Rating must be less or equal to 10" }),
    review: z
      .string({ message: "Review must be a string" })
      .nonempty({ message: "Review is required" })
      .min(10, { message: "Review must be at least 10 characters long" })
      .max(500, { message: "Review must not be longer than 500 characters" }),
  })
  .strict();

export const validateBusinessReviewBody = (req, res, next) => {
  try {
    businessReviewSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(
        new RequestBodyValidationError(err.errors.map((error) => error.message).join(", "))
      );
    }

    next();
  }
};
