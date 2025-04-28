import express from "express";
import { getDishes, getMenu, getMenuItem } from "../controllers/DishController.js";

const router = express.Router();

router.get("/menu/:businessid", getMenu);

router.get("/menu/:businessid/:dishid", getMenuItem);

router.get("/", getDishes);

export default router;
