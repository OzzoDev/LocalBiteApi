import express from "express";
import BusinessReviewRouter from "./BusinessReviewRouter.js";
import DishReviwRouter from "./DishReviewRouter.js";
import { ensureBusinessExists, ensureDishExists } from "../middlewares/Resources.js";
import { getEveryReviews } from "../controllers/BusinessReviewController.js";

const router = express.Router();

router.use("/businesses/:businessid", ensureBusinessExists, BusinessReviewRouter);

router.use("/dishes/:dishid", ensureDishExists, DishReviwRouter);

router.get("/businesses", getEveryReviews);

export default router;
