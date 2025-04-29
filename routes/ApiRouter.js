import express from "express";
import DishRouter from "./DishRouter.js";
import BusinessRouter from "./BusinessRouter.js";
import ReviewRouter from "./ReviewRouter.js";

const router = express.Router();

router.use("/dishes", DishRouter);

router.use("/businesses", BusinessRouter);

router.use("/reviews", ReviewRouter);

export default router;
