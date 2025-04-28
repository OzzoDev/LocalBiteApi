import express from "express";
import { getBusinessById, getBusinesses } from "../controllers/BusinessController.js";

const router = express.Router();

router.get("/:businessid", getBusinessById);

router.get("/", getBusinesses);

export default router;
