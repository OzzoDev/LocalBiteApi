import express from "express";
import { getBusinesses, getNearbyBusinesses } from "../controllers/BusinessController.js";
import { validateNearbyBusinessQuery } from "../validators/businesses.js";

const router = express.Router();

router.get("/", getBusinesses);

router.get("/nearby", validateNearbyBusinessQuery, getNearbyBusinesses);

export default router;
