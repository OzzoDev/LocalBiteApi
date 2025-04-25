import express from "express";
import ReviewRouter from "./ReviewRouter.js";
import { getRestaurants } from "../controllers/ApiController.js";

const router = express.Router();

router.use("/review", ReviewRouter);

router.get("/restaurants", getRestaurants);

export default router;
