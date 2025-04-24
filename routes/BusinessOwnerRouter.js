import express from "express";
import {
  alterDish,
  appendDish,
  registerBusiness,
  removeDish,
} from "../controllers/BusinessOwnerController.js";
import {
  validateBusinessBody,
  validateDishBody,
  validateDishUpdateBody,
} from "../validators/business.js";

const router = express.Router();

router.post("/register", validateBusinessBody, registerBusiness);

router.post("/dish/:businessid", validateDishBody, appendDish);

router.patch("/dish/:businessid/:dishid", validateDishUpdateBody, alterDish);

router.delete("/dish/:businessid/:dishid", removeDish);

export default router;
