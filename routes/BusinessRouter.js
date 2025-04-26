import express from "express";
import { getBusinesses, getNearbyBusinesses } from "../controllers/BusinessController.js";

const router = express.Router();

router.get("/", getBusinesses);

router.get("/nearby", getNearbyBusinesses);

export default router;
