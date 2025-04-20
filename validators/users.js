import { z } from "zod";

const newUserSchema = z
  .object({
    username: z
      .string({ message: "Incorrect username" })
      .nonempty({ message: "Username is required" })
      .min(3, { message: "Username must be atleast 3 characters long" })
      .max(30, { message: "Username cannot be longer than 30 characters" }),
    email: z.string({ message: "Incorrect email" }).email({ message: "Incorrect email" }),
    password: z
      .string({ message: "Incorrect password" })
      .nonempty({ message: "Password is required" })
      .min(8, { message: "Password must be atleast 8 characters long" }),
  })
  .strict();

export const validateNewUser = (req, res, next) => {
  try {
    newUserSchema.parse(req.body);
    next();
  } catch (err) {
    res
      .status(400)
      .json({ message: err.errors.map((error) => error.message).join(", "), success: false });
  }
};
