import express from "express";
import { validateDishBody, validateDishUpdateBody } from "../validators/dishes.js";
import {
  alterDish,
  appendDish,
  getDish,
  getDishes,
  removeDish,
} from "../controllers/OwnerDishController.js";

const router = express.Router({ mergeParams: true });

router.get("/:dishid", getDish);

router.get("/", getDishes);

router.post("/", validateDishBody, appendDish);

router.patch("/:dishid", validateDishUpdateBody, alterDish);

router.delete("/:dishid", removeDish);

export default router;
