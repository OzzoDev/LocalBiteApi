import express from "express";
import BusinessReviewRouter from "./BusinessReviewRouter.js";
import DishReviwRouter from "./DishReviewRouter.js";
import { ensureDishExists } from "../middlewares/Resources.js";

const router = express.Router();

router.use("/business", BusinessReviewRouter);
router.use("/dish/:dishid", ensureDishExists, DishReviwRouter);

export default router;
