import { BusinessNotFoundError, UpdateError } from "../../errors/BusinessOwnerError.js";
import { NotUserReview, ReviewNotFoundError } from "../../errors/ReviewErrors.js";
import { findBusiness } from "./businesses.js";
import { executeQuery } from "./init.js";

export const addReview = async (data) => {
  const { userId, businessId, rating, review } = data;

  const business = await findBusiness(businessId);

  if (!business) {
    throw new BusinessNotFoundError();
  }

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

export const deleteReview = async (userId, reviewId) => {
  const rev = await findBusinessReview(reviewId);

  if (rev.user_id !== parseInt(userId, 10)) {
    throw new NotUserReview();
  }

  const query = `
    DELETE FROM business_reviews
    WHERE id = $1; 
  `;

  return await executeQuery(query, [parseInt(reviewId, 10)]);
};

export const updateReview = async (data) => {
  const { userId, reviewId, rating, review } = data;

  const rev = await findBusinessReview(reviewId);

  if (rev.user_id !== parseInt(userId, 10)) {
    throw new NotUserReview();
  }

  const fieldsToUpdate = {
    ...(rating !== undefined && { rating }),
    ...(review !== undefined && { review }),
  };

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new UpdateError();
  }

  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");

  const query = `
    UPDATE business_reviews
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

  values.push(parseInt(reviewId, 10));

  return await executeQuery(query, values);
};

export const findReview = async (reviewId) => {
  const query = `
    SELECT * FROM business_reviews
    WHERE id = $1
  `;

  const result = await executeQuery(query, [parseInt(reviewId, 10)]);

  if (result.length === 0) {
    // throw new ReviewNotFoundError(`Review with id '${reviewId}' not found`);
    throw new ReviewNotFoundError();
  }

  return result[0];
};

export const findReviews = async (businessId) => {
  const query = `
    SELECT * FROM business_reviews
    WHERE business_id = $1
  `;

  return await executeQuery(query, [parseInt(businessId, 10)]);
};
