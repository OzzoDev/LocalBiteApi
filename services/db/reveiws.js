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
