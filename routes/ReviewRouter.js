import express from "express";
import BusinessReviewRouter from "./BusinessReviewRouter.js";
import DishReviwRouter from "./DishReviewRouter.js";
import { ensureBusinessExists, ensureDishExists } from "../middlewares/Resources.js";

const router = express.Router();

router.use("/business/:businessid", ensureBusinessExists, BusinessReviewRouter);

router.use("/dish/:dishid", ensureDishExists, DishReviwRouter);

export default router;
