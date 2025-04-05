import express from "express";
import { getRestaurants } from "../controllers/ApiController.js";

const router = express.Router();

router.get("/restaurants", getRestaurants);

export default router;
