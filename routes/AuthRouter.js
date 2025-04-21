import express from "express";
import { signin, signup, signout, verify } from "../controllers/AuthController.js";
import {
  validateLoginAttempt,
  validateNewUser,
  validateUserVerification,
} from "../validators/users.js";

const router = express.Router();

router.post("/signup", validateNewUser, signup);
router.post("/signin", validateLoginAttempt, signin);
router.post("/verify", validateUserVerification, verify);
router.post("/signout", signout);

export default router;
