import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { RequestBodyValidationError } from "../errors/ValidationErrors.js";
import { getCountryCodeFromName } from "../utils/utils.js";

const businessSchema = z
  .object({
    businessName: z
      .string({ message: "Business name is required" })
      .nonempty({ message: "Business name cannot be empty" })
      .min(2, { message: "Business name must be at least 2 characters long" })
      .max(100, { message: "Business name cannot be longer than 100 characters" }),
    country: z
      .string({ message: "Country is required" })
      .nonempty({ message: "Country cannot be empty" })
      .min(2, { message: "Country must be at least 2 characters long" })
      .max(20, { message: "Country cannot be longer than 20 characters" }),
    city: z
      .string({ message: "City is required" })
      .nonempty({ message: "City cannot be empty" })
      .min(2, { message: "City must be at least 2 characters long" })
      .max(30, { message: "City cannot be longer than 30 characters" }),
    address: z
      .string({ message: "Address is required" })
      .nonempty({ message: "Address cannot be empty" })
      .min(5, { message: "Address must be at least 5 characters long" })
      .max(50, { message: "Address cannot be longer than 50 characters" }),
    zipCode: z
      .string({ message: "Zip code is required" })
      .nonempty({ message: "Zip code cannot be empty" })
      .min(3, { message: "Zip code must be at least 3 characters long" })
      .max(10, { message: "Zip code cannot be longer than 10 characters" }),
    businessPhone: z.string().nonempty({ message: "Business phone is required" }),
    businessWebsite: z
      .string({ message: "Invalid format for business website" })
      .url({ message: "Invalid format for business website" })
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      const { country, businessPhone } = data;
      const countryCode = getCountryCodeFromName(country);

      if (!countryCode) return false;

      const phoneObj = parsePhoneNumberFromString(businessPhone, countryCode);
      return phoneObj && phoneObj.isValid();
    },
    {
      message: "Invalid phone number for the selected country",
      path: ["businessPhone"],
    }
  );

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

export const validateBusinessBody = (req, _, next) => {
  try {
    businessSchema.parse(req.body);
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
