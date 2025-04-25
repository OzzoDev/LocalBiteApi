import express from "express";
import {
  alterDish,
  appendDish,
  getDish,
  getDishes,
  registerBusiness,
  removeDish,
} from "../controllers/BusinessOwnerController.js";
import {
  validateBusinessBody,
  validateDishBody,
  validateDishUpdateBody,
} from "../validators/business.js";
import { authorizeBusinessOwner } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/register", validateBusinessBody, registerBusiness);

router.use("/", authorizeBusinessOwner);

router.get("/dishes/:businessid", getDishes);

router.get("/dishes/:businessid/:dishid", getDish);

router.post("/dishes/:businessid", validateDishBody, appendDish);

router.patch("/dishes/:businessid/:dishid", validateDishUpdateBody, alterDish);

router.delete("/dishes/:businessid/:dishid", removeDish);

export default router;
