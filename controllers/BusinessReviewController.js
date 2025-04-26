import {
  addReview,
  deleteReview,
  findReview,
  findReviews,
  updateReview,
} from "../services/db/businessReviews.js";

export const review = async (req, res, next) => {
  const { businessid: businessId } = req.params;
  const { id: userId } = req.user;

  try {
    await addReview({ userId, businessId, ...req.body });

    res.status(201).json({ message: "Business review added sucessfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  const { businessid: businessId } = req.params;

  try {
    const reviews = await findReviews(businessId);

    res.status(200).json({ reviews, success: true });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;

  try {
    const review = await findReview(reviewId);

    res.status(200).json({ review, success: true });
  } catch (err) {
    next(err);
  }
};

export const editReview = async (req, res, next) => {
  const { businessid: businessId } = req.params;
  const { id: userId } = req.user;
  try {
    const review = await updateReview({ userId, businessId, ...req.body });

    res
      .status(200)
      .json({ message: `Review with id '${review.id}' updated successfully`, success: true });
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
      .json({ message: `Review with id '${reviewId}' deleted successfully`, success: true });
  } catch (err) {
    next(err);
  }
};
