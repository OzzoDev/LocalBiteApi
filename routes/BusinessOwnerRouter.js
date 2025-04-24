import express from "express";
import { appendDish, registerBusiness } from "../controllers/BusinessOwnerController.js";
import { validateBusinessBody, validateDishBody } from "../validators/business.js";

const router = express.Router();

router.post("/register", validateBusinessBody, registerBusiness);

router.post("/dish/:businessid", validateDishBody, appendDish);

export default router;
