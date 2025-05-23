import { BusinessNotFoundError, UpdateError } from "../../errors/BusinessOwnerError.js";
import { NotUserReview, ReviewNotFoundError } from "../../errors/ReviewErrors.js";
import { executeQuery } from "./init.js";

export const addReview = async (data) => {
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

export const deleteReview = async (userId, reviewId) => {
  const rev = await findReview(reviewId);

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

  const rev = await findReview(reviewId);

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
    throw new ReviewNotFoundError(`Review with id '${reviewId}' not found`);
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

export const findRatingStats = async (businessId) => {
  const query = `
    SELECT 
      AVG(rating) AS avg_rating, 
      MIN(rating) AS min_rating, 
      MAX(rating) AS max_rating, 
      COUNT(review) AS review_count 
    FROM business_reviews
    WHERE business_id = $1
  `;

  const result = await executeQuery(query, [parseInt(businessId, 10)]);

  if (result.length === 0) {
    throw new BusinessNotFoundError();
  }

  const averageRating = Math.round(result[0].avg_rating || 0);
  const minRating = result[0].min_rating || 0;
  const maxRating = result[0].max_rating || 0;
  const numReviews = parseInt(result[0].review_count, 10) || 0;

  return { averageRating, minRating, maxRating, reviewCount: numReviews };
};

export const queryEveryReview = async (requestQuery) => {
  const { sort, order, page = 1, limit = 10 } = requestQuery;
  const offset = (page - 1) * limit;

  let query = `
    SELECT *
    FROM business_reviews
  `;

  const allowedSortFields = ["rating"];
  const validSort = allowedSortFields.includes(sort) ? sort : "created_at";
  const validOrder = order === "asc" ? "ASC" : "DESC";

  query += ` ORDER BY ${validSort} ${validOrder} LIMIT $1 OFFSET $2`;

  return await executeQuery(query, [limit, offset]);
};

export const queryReviews = async (requestQuery, businessId) => {
  const { sort, order, page = 1, limit = 10 } = requestQuery;
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      business_reviews.id AS id,
      business_reviews.rating AS rating,
      business_reviews.review AS review,
      business_reviews.user_id AS user_id,
      business_reviews.created_at AS created_at,
      businesses.id AS business_id,
      businesses.business_name AS business_name,
      businesses.country AS country,
      businesses.city AS city
    FROM business_reviews
    INNER JOIN businesses
      ON business_reviews.business_id = businesses.id
    WHERE business_id = $1
  `;

  const allowedSortFields = ["rating"];
  const validSort = allowedSortFields.includes(sort) ? sort : "created_at";
  const validOrder = order === "asc" ? "ASC" : "DESC";

  query += ` ORDER BY ${validSort} ${validOrder} LIMIT $2 OFFSET $3`;

  return await executeQuery(query, [parseInt(businessId, 10), limit, offset]);
};
