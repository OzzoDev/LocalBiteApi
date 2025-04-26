import express from "express";
import DishRouter from "./DishRouter.js";
import ReviewRouter from "./ReviewRouter.js";
import { getRestaurants } from "../controllers/ApiController.js";

const router = express.Router();

router.use("/dish", DishRouter);

router.use("/review", ReviewRouter);

router.get("/restaurants", getRestaurants);

export default router;
