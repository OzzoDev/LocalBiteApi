import {
  addReview,
  deleteReview,
  findRatingStats,
  findReview,
  findReviews,
  queryEveryReview,
  updateReview,
} from "../services/db/dishReviews.js";
import { getLocation } from "../utils/utils.js";

export const getReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;

  try {
    const review = await findReview(reviewId);
    res.status(200).json({ review, success: true });
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  const { dishid: dishId } = req.params;

  try {
    const reviews = await findReviews(dishId);
    res.status(200).json({ reviews, success: true });
  } catch (err) {
    next(err);
  }
};

export const getRatingStats = async (req, res, next) => {
  const { dishid: dishId } = req.params;

  try {
    const ratingStats = await findRatingStats(dishId);
    res.status(200).json({ ratingStats, success: true });
  } catch (err) {
    next(err);
  }
};

export const review = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    await addReview({ userId, ...req.body });

    res.status(201).json({ message: "Dish review added successfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const editReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;
  const { id: userId } = req.user;

  try {
    await updateReview({ userId, reviewId, ...req.body });

    res
      .status(200)
      .json({ message: `Dish with id '${reviewId}' updated successfully`, success: true });
  } catch (err) {
    next(err);
  }
};

export const removeReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;
  const { id: userId } = req.user;

  try {
    await deleteReview(userId, reviewId);

    res
      .status(200)
      .json({ message: `Dish with id '${reviewId}' deleted successfully`, success: true });
  } catch (err) {
    next(err);
  }
};

export const getEveryReview = async (req, res, next) => {
  const { lat: latitude, lon: longitude } = req.query;

  try {
    const location = await getLocation(latitude, longitude);

    const reviews = await queryEveryReview(req.query, location);
    res.status(200).json({ reviews, success: true });
  } catch (err) {
    next(err);
  }
};

export const getEveryBusinessReview = async (req, res, next) => {
  const { businessid: businessId } = req.query;

  try {
    const reviews = await queryEveryReview(req.query, businessId);
    res.status(200).json({ reviews, success: true });
  } catch (err) {
    next(err);
  }
};
