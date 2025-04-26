import express from "express";
import {
  editReview,
  getReview,
  getReviews,
  removeReview,
  review,
} from "../controllers/BusinessReviewController.js";
import { validateReviewBody, validateUpdateReviewBody } from "../validators/businessReviews.js";

const router = express.Router({ mergeParams: true });

router.get("/:businessid", getReviews);

router.get("/:businessid/:reviewid", getReview);

router.post("/:businessid", validateReviewBody, review);

router.patch("/:businessid/:reviewid", validateUpdateReviewBody, editReview);

router.delete("/:businessid/:reviewid", removeReview);

export default router;
