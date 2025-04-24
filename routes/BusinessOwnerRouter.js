import express from "express";
import { registerBusiness } from "../controllers/BusinessOwnerController.js";
import { validateNewBusiness } from "../validators/business.js";

const router = express.Router();

router.post("/register", validateNewBusiness, registerBusiness);

export default router;
