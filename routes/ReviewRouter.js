import express from "express";
import BusinessReviewRouter from "./BusinessReviewRouter.js";
import DishReviwRouter from "./DishReviewRouter.js";

const router = express.Router();

router.use("/business", BusinessReviewRouter);
router.use("/dish", DishReviwRouter);

export default router;
