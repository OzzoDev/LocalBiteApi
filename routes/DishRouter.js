import express from "express";
import { getDishes, getMenu } from "../controllers/DishController.js";

const router = express.Router();

router.get("/menu/:businessid", getMenu);

router.get("/", getDishes);

export default router;
