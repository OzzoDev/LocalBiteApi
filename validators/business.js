import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const newBusinessSchema = z.object({
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
  businessPhone: z.string().refine(
    (phone) => {
      const phoneNumberObj = parsePhoneNumberFromString(phone);
      return phoneNumberObj && phoneNumberObj.isValid();
    },
    {
      message: "Invalid phone number format",
    }
  ),
  businessWebsite: z
    .string({ message: "Invalid format for business website" })
    .url({ message: "Invalid format for business website" })
    .optional(),
});

export const validateNewBusiness = (req, _, next) => {
  try {
    newBusinessSchema.parse(req.body);
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
