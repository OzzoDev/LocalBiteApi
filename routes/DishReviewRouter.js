import express from "express";
import {
  editReview,
  getRatingStats,
  getReview,
  getReviews,
  removeReview,
  review,
} from "../controllers/DishReviewController.js";
import { validateReviewBody, validateUpdateReviewBody } from "../validators/reviews.js";

const router = express.Router({ mergeParams: true });

router.get("/:reviewid", getReview);

router.get("/rating", getRatingStats);

router.get("/", getReviews);

router.post("/", validateReviewBody, review);

router.patch("/", validateUpdateReviewBody, editReview);

router.delete("/", removeReview);

export default router;
