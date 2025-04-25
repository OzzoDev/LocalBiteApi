import express from "express";
import DishRouter from "./DishRouter.js";
import { registerBusiness, unregisterBusiness } from "../controllers/BusinessOwnerController.js";
import { validateBusinessBody } from "../validators/business.js";
import { authorizeBusinessOwner } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/", validateBusinessBody, registerBusiness);

router.delete("/:businessid/:deletecommand", unregisterBusiness);

router.use("/:businessid/dishes", authorizeBusinessOwner, DishRouter);

export default router;
