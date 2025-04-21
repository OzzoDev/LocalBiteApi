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

router.get("/password-reset-otp/:identifer", ensureNotLoggedIn, requestPasswordResetOtp);

router.post("/signup", ensureNotLoggedIn, validateNewUser, signup);
router.post("/signin", ensureNotLoggedIn, ensureNotSuspended, validateLoginAttempt, signin);
router.post("/verify", ensureNotLoggedIn, ensureNotSuspended, validateUserVerification, verify);
router.post("/signout", authenticate, signout);
router.post("/reset-password", ensureNotLoggedIn, validatePasswordReset, resetPassword);

export default router;
