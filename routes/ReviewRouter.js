import express from "express";
import {
  validateBusinessReviewBody,
  validateBusinessUpdateReviewBody,
} from "../validators/reviews";

const router = express.Router();

router.post("/business/:businessid", validateBusinessReviewBody, reviewBusiness);

router.patch(
  "/business/:businessid/:reviewid",
  validateBusinessUpdateReviewBody,
  editBusinessReview
);

router.delete("/business/:businessid/:reviewid", deleteBusinessReview);

export default router;
