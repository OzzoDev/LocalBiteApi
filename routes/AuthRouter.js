import express from "express";
import {
  signin,
  signup,
  signout,
  verify,
  requestPasswordResetOtp,
  resetPassword,
} from "../controllers/AuthController.js";
import {
  validateLoginAttempt,
  validateNewUser,
  validateUserVerification,
  validatePasswordReset,
} from "../validators/users.js";
import { authenticate, ensureNotLoggedIn, ensureNotSuspended } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/signout", authenticate, signout);

router.use("/", ensureNotLoggedIn, ensureNotSuspended);

router.get("/password-reset-otp/:identifer", requestPasswordResetOtp);

router.post("/signup", validateNewUser, signup);
router.post("/signin", validateLoginAttempt, signin);
router.post("/verify", validateUserVerification, verify);
router.post("/reset-password", validatePasswordReset, resetPassword);

export default router;
