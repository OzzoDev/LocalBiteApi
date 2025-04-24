import express from "express";
import { appendDish, registerBusiness } from "../controllers/BusinessOwnerController.js";
import { validateNewBusiness } from "../validators/business.js";

const router = express.Router();

router.post("/register", validateNewBusiness, registerBusiness);

router.post("/dish", appendDish);

export default router;
