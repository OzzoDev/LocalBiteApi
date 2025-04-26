import express from "express";
import { getBusinesses } from "../controllers/BusinessController.js";

const router = express.Router();

router.get("/", getBusinesses);

export default router;
