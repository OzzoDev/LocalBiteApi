import express from "express";
import { signin, signup, signout } from "../controllers/AuthController.js";
import { validateLoginAttempt, validateNewUser } from "../validators/users.js";

const router = express.Router();

router.post("/signup", validateNewUser, signup);
router.post("/signin", validateLoginAttempt, signin);
router.post("/signout", signout);

export default router;
