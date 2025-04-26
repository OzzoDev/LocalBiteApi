import express from "express";
import OwnerDishRouter from "./OwnerDishRouter.js";
import { validateBusinessBody } from "../validators/businesses.js";
import { authorizeBusinessOwner } from "../middlewares/Auth.js";
import {
  getBusinesses,
  registerBusiness,
  unregisterBusiness,
} from "../controllers/OwnerController.js";

const router = express.Router();

router.get("/", getBusinesses);

router.post("/", validateBusinessBody, registerBusiness);

router.delete("/:businessid/:deletecommand", unregisterBusiness);

router.use("/:businessid/dishes", authorizeBusinessOwner, OwnerDishRouter);

export default router;
