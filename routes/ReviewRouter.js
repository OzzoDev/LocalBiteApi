import express from "express";
import {
  validateBusinessReviewBody,
  validateBusinessUpdateReviewBody,
} from "../validators/reviews.js";
import {
  editBusinessReview,
  removeBusinessReview,
  reviewBusiness,
} from "../controllers/ReviewController.js";

const router = express.Router();

router.post("/business/:businessid", validateBusinessReviewBody, reviewBusiness);

router.patch(
  "/business/:businessid/:reviewid",
  validateBusinessUpdateReviewBody,
  editBusinessReview
);

router.delete("/business/:businessid/:reviewid", removeBusinessReview);

export default router;
