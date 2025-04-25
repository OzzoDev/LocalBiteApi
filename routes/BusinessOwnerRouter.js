import express from "express";
import DishRouter from "./DishRouter.js";
import { registerBusiness } from "../controllers/BusinessOwnerController.js";
import { validateBusinessBody } from "../validators/business.js";
import { authorizeBusinessOwner } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/register", validateBusinessBody, registerBusiness);

router.use("/:businessid/dishes", authorizeBusinessOwner, DishRouter);

export default router;
