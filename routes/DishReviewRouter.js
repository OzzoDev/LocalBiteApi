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

const router = express.Router();

router.get("/:dishid/:reviewid", getReview);

router.get("/:dishid/rating", getRatingStats);

router.get("/:dishid", getReviews);

router.post("/", validateReviewBody, review);

router.patch("/:dishid", validateUpdateReviewBody, editReview);

router.delete("/:dishid", removeReview);

export default router;
