import express from "express";
import BusinessReviewRouter from "./BusinessReviewRouter.js";
import DishReviwRouter from "./DishReviewRouter.js";
import { ensureBusinessExists, ensureDishExists } from "../middlewares/Resources.js";
import { getEveryReview as getEveryBusinessReview } from "../controllers/BusinessReviewController.js";
import {
  getDishReviewByBusiness,
  getEveryReview as getEveryDishReview,
} from "../controllers/DishReviewController.js";

const router = express.Router();

router.use("/businesses/:businessid", ensureBusinessExists, BusinessReviewRouter);

router.use("/dishes/:dishid", ensureDishExists, DishReviwRouter);

router.get("/businesses", getEveryBusinessReview);

router.get("/dishes", getEveryDishReview);

router.get("/:businessid/dishes", getDishReviewByBusiness);

export default router;
