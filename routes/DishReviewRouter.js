import express from "express";
import {
  editReview,
  getRatingStats,
  getReview,
  getReviews,
  removeReview,
  review,
} from "../controllers/DishReviewController.js";

const router = express.Router();

router.get("/:dishid/:reviewid", getReview);

router.get("/:dishid/rating", getRatingStats);

router.get("/:dishid", getReviews);

router.post("/", review);

router.patch("/:dishid", editReview);

router.delete("/:dishid", removeReview);

export default router;
