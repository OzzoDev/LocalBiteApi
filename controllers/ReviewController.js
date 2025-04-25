import {
  addBusinessReview,
  deleteBusinessReview,
  updateBusinessReview,
} from "../services/db/reveiws";

export const reviewBusiness = async (req, res, next) => {
  const { businessid: businessId } = req.params;
  const { id: userId } = req.user;

  try {
    await addBusinessReview({ userId, businessId, ...req.body });

    res.status(201).json({ message: "Business review added sucessfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const editBusinessReview = async (req, res, next) => {
  const { businessid: businessId } = req.params;
  const { id: userId } = req.user;
  try {
    const review = await updateBusinessReview({ userId, businessId, ...req.body });

    res
      .status(200)
      .json({ message: `Review with id '${review.id}' updated successfully`, success: true });
  } catch (err) {
    next(err);
  }
};

export const removeBusinessReview = async (req, res, next) => {
  const { reviewid: reviewId } = req.params;
  const { id: userId } = req.user;
  try {
    await deleteBusinessReview(userId, reviewId);

    res
      .status(200)
      .json({ message: `Review with id '${reviewId}' deleted successfully`, success: true });
  } catch (err) {
    next(err);
  }
};
