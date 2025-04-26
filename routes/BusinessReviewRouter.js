import express from "express";
import {
  editReview,
  getReviews,
  removeReview,
  review,
} from "../controllers/BusinessReviewController.js";
import { validateReviewBody, validateUpdateReviewBody } from "../validators/businessReviews.js";

const router = express.Router({ mergeParams: true });

router.get("/:businessid", getReviews);

router.post("/:businessid", validateReviewBody, review);

router.patch("/:businessid/:reviewid", validateUpdateReviewBody, editReview);

router.delete("/:businessid/:reviewid", removeReview);

export default router;
