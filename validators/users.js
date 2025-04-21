import { z } from "zod";
import { RequestBodyValidationError } from "../errors/ValidationErrors.js";

const newUserSchema = z
  .object({
    username: z
      .string({ message: "Username is required" })
      .nonempty({ message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(30, { message: "Username cannot be longer than 30 characters" }),
    email: z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
    password: z
      .string({ message: "Password is required" })
      .nonempty({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .strict();

const loginAttemptSchema = z
  .object({
    username: z.string({ message: "Username is required" }).optional(),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email format" })
      .optional(),
    password: z
      .string({ message: "Password is required" })
      .nonempty({ message: "Password is required" }),
  })
  .strict()
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided.",
    path: ["username"],
  });

const verifyUserSchema = z
  .object({
    username: z.string({ message: "Username is required" }).optional(),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Invalid email format" })
      .optional(),
    otp: z
      .string({ message: "Verification code is required" })
      .nonempty({ message: "Verification code is required" }),
  })
  .strict()
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided.",
    path: ["username"],
  });

export const validateNewUser = (req, _, next) => {
  try {
    newUserSchema.parse(req.body);
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

export const validateLoginAttempt = (req, _, next) => {
  try {
    loginAttemptSchema.parse(req.body);
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

export const validateUserVerification = (req, _, next) => {
  try {
    verifyUserSchema.parse(req.body);
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
