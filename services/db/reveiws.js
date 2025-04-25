import { NotUserReview, ReviewNotFoundError } from "../../errors/ReviewErrors.js";
import { executeQuery } from "./init.js";

export const addBusinessReview = async (data) => {
  const { userId, businessId, rating, review } = data;

  const query = `
    INSERT INTO business_reviews (user_id, business_id, rating, review)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, business_id)
    DO UPDATE SET rating = $3, review = $4, created_at = CURRENT_TIMESTAMP
    RETURNING *;       
  `;

  const result = await executeQuery(query, [
    parseInt(userId, 10),
    parseInt(businessId, 10),
    rating,
    review,
  ]);
  return result[0];
};

export const deleteBusinessReview = async (userId, reviewId) => {
  const review = await findBusinessReview(reviewId);

  if (review.user_id !== parseInt(userId, 10)) {
    throw new NotUserReview();
  }

  const query = `
    DELETE FROM business_reviews
    WHERE id = $1; 
  `;

  return await executeQuery(query, [parseInt(reviewId, 10)]);
};

export const findBusinessReview = async (reviewId) => {
  const query = `
    SELECT * FROM business_reviews
    WHERE id = $1
  `;

  const result = await executeQuery(query, [parseInt(reviewId, 10)]);

  if (result.length === 0) {
    throw new ReviewNotFoundError(`Review with id '${reviewId}' not found`);
  }

  return result[0];
};
