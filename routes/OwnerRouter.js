import express from "express";
import OwnerDishRouter from "./OwnerDishRouter.js";
import {
  getBusinesses,
  registerBusiness,
  unregisterBusiness,
} from "../controllers/BusinessOwnerController.js";
import { validateBusinessBody } from "../validators/businesses.js";
import { authorizeBusinessOwner } from "../middlewares/Auth.js";

const router = express.Router();

router.get("/", getBusinesses);

router.post("/", validateBusinessBody, registerBusiness);

router.delete("/:businessid/:deletecommand", unregisterBusiness);

router.use("/:businessid/dishes", authorizeBusinessOwner, OwnerDishRouter);

export default router;
