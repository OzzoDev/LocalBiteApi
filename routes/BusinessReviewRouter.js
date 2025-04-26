import express from "express";
import {
  editReview,
  getRatingStats,
  getReview,
  getReviews,
  removeReview,
  review,
} from "../controllers/BusinessReviewController.js";
import { validateReviewBody, validateUpdateReviewBody } from "../validators/reviews.js";

const router = express.Router({ mergeParams: true });

router.get("/rating", getRatingStats);

router.get("/:reviewid", getReview);

router.get("/", getReviews);

router.post("/", validateReviewBody, review);

router.patch("/", validateUpdateReviewBody, editReview);

router.delete("/", removeReview);

export default router;
