import express from "express";

const router = express.Router();

router.post("/business/:businessid", reviewBusiness);

router.patch("/business/:businessid/:reviewid", editBusinessReview);

router.delete("/business/:businessid/:reviewid", deleteBusinessReview);

export default router;
