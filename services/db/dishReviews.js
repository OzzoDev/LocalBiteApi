import { UpdateError } from "../../errors/BusinessOwnerError.js";
import { DishNotFoundError } from "../../errors/ResourceErrors.js";
import { NotUserReview, ReviewNotFoundError } from "../../errors/ReviewErrors.js";
import { executeQuery } from "./init.js";

export const addReview = async (data) => {
  const { userId, rating, review } = data;

  const query = `
    INSERT INTO dish_reviews (user_id, rating, review)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, dish_id)
    DO UPDATE SET rating = $2, review = $3, created_at = CURRENT_TIMESTAMP
    RETURNING *;       
  `;

  const result = await executeQuery(query, [parseInt(userId, 10), rating, review]);

  return result[0];
};

export const deleteReview = async (userId, reviewId) => {
  const rev = await findReview(reviewId);

  if (rev.user_id !== parseInt(userId, 10)) {
    throw new NotUserReview();
  }

  const query = `
    DELETE FROM dish_reviews
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
    UPDATE dish_reviews
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

  values.push(parseInt(reviewId, 10));

  return await executeQuery(query, values);
};

export const findReview = async (reviewId) => {
  const query = `
    SELECT * FROM dish_reviews
    WHERE dish_id = $1
  `;

  const result = await executeQuery(query, [parseInt(reviewId, 10)]);

  if (result.length === 0) {
    throw new ReviewNotFoundError(`Review with id '${reviewId}' not found`);
  }

  return result[0];
};

export const findReviewById = async (dishId) => {
  const query = `
    SELECT  
      dish_reviews.id AS id, 
      dish_reviews.rating AS rating,
      dish_reviews.review AS review,
      dish_reviews.dish_id AS dish_id,
      dish_reviews.created_at AS created_at,
      dishes.dish_name AS dish_name,
      dishes.description AS description, 
      CAST(dishes.price AS INTEGER) AS price,
      businesses.business_name AS business_name,
      businesses.country AS country, 
      businesses.city AS city
    FROM dish_reviews
    JOIN dishes 
      ON dish_reviews.dish_id = dishes.id
    JOIN businesses 
      ON dishes.business_id = businesses.id
    WHERE dish_reviews.id = $1
  `;

  return await executeQuery(query, [parseInt(dishId, 10)]);
};

export const findRatingStats = async (dishId) => {
  const query = `
    SELECT 
      AVG(rating) AS avg_rating, 
      MIN(rating) AS min_rating, 
      MAX(rating) AS max_rating, 
      COUNT(review) AS review_count 
    FROM dish_reviews
    WHERE dish_id = $1
  `;

  const result = await executeQuery(query, [parseInt(dishId, 10)]);

  if (result.length === 0) {
    throw new DishNotFoundError();
  }

  const averageRating = Math.round(result[0].avg_rating || 0);
  const minRating = result[0].min_rating || 0;
  const maxRating = result[0].max_rating || 0;
  const numReviews = parseInt(result[0].review_count, 10) || 0;

  return { averageRating, minRating, maxRating, reviewCount: numReviews };
};

export const queryEveryReview = async (requestQuery, location) => {
  const { sort, order, page = 1, limit = 10 } = requestQuery;
  const offset = (page - 1) * limit;
  const params = [];

  let query = `
    SELECT 
      dish_reviews.id AS id, 
      dish_reviews.rating AS rating,
      dish_reviews.review AS review,
      dish_reviews.dish_id AS dish_id,
      dish_reviews.created_at AS created_at,
      dishes.dish_name AS dish_name,
      dishes.description AS description, 
      CAST(dishes.price AS INTEGER) AS price,
      businesses.business_name AS business_name,
      businesses.country AS country, 
      businesses.city AS city
    FROM dish_reviews
    JOIN dishes 
      ON dish_reviews.dish_id = dishes.id
    JOIN businesses 
      ON dishes.business_id = businesses.id
  `;

  if (location) {
    params.push(`%${location.toLowerCase()}%`);
    query += ` WHERE LOWER(businesses.city) ILIKE $${params.length} `;
  }

  const allowedSortFields = ["rating"];
  const validSort = allowedSortFields.includes(sort) ? sort : "created_at";
  const validOrder = order === "asc" ? "ASC" : "DESC";

  params.push(limit, offset);

  query += ` ORDER BY ${validSort} ${validOrder} LIMIT $${params.length - 1} OFFSET $${
    params.length
  } `;

  return await executeQuery(query, params);
};

export const queryReviewByBusiness = async (requestQuery, businessId) => {
  const { sort, order, page = 1, limit = 10 } = requestQuery;
  const offset = (page - 1) * limit;
  const params = [];

  let query = `
    SELECT dish_reviews.*
    FROM dish_reviews
    JOIN dishes ON dish_reviews.dish_id = dishes.id
    JOIN businesses ON dishes.business_id = businesses.id
  `;

  params.push(parseInt(businessId, 10));
  query += ` WHERE businesses.id = $1`;

  const allowedSortFields = ["rating", "created_at"];
  const validSort = allowedSortFields.includes(sort) ? sort : "created_at";
  const validOrder = order === "asc" ? "ASC" : "DESC";

  params.push(limit, offset);

  query += ` ORDER BY ${validSort} ${validOrder} LIMIT $${params.length - 1} OFFSET $${
    params.length
  } `;

  return await executeQuery(query, params);
};
