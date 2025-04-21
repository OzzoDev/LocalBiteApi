import express from "express";
import { signin, signup, signout, verify } from "../controllers/AuthController.js";
import {
  validateLoginAttempt,
  validateNewUser,
  validateUserVerification,
} from "../validators/users.js";
import { authenticate, ensureNotLoggedIn, ensureNotSuspended } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/signout", authenticate, signout);

router.use("/", ensureNotLoggedIn, ensureNotSuspended);

router.post("/signup", validateNewUser, signup);
router.post("/signin", validateLoginAttempt, signin);
router.post("/verify", validateUserVerification, verify);

export default router;
