import express from "express";
import { validateDishBody, validateDishUpdateBody } from "../validators/business.js";
import {
  alterDish,
  appendDish,
  getDish,
  getDishes,
  removeDish,
} from "../controllers/DishController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getDishes);

router.get("/:dishid", getDish);

router.post("/", validateDishBody, appendDish);

router.patch("/:dishid", validateDishUpdateBody, alterDish);

router.delete("/:dishid", removeDish);

export default router;
