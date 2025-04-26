import express from "express";
import {
  editReview,
  getRatingStats,
  getReview,
  getReviews,
  removeReview,
  review,
} from "../controllers/BusinessReviewController.js";
import { validateReviewBody, validateUpdateReviewBody } from "../validators/businessReviews.js";

const router = express.Router({ mergeParams: true });

router.get("/:businessid/rating", getRatingStats);

router.get("/:businessid/:reviewid", getReview);

router.get("/:businessid", getReviews);

router.post("/:businessid", validateReviewBody, review);

router.patch("/:businessid/:reviewid", validateUpdateReviewBody, editReview);

router.delete("/:businessid/:reviewid", removeReview);

export default router;
