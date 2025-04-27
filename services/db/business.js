import { executeQuery } from "./init.js";

export const findBusinesses = async () => {
  const query = `
    SELECT 
      businesses.id AS business_id,
      businesses.business_name AS business_name,
      businesses.country AS country,
      businesses.city AS city,
      businesses.address AS address,
      businesses.zip_code AS zip_code,
      businesses.business_phone AS business_phone,
      businesses.business_website AS business_website,
      businesses.created_at AS created_at,
      CAST(COUNT(business_reviews.review) AS INTEGER) AS review_count,
      CAST(ROUND(AVG(business_reviews.rating), 2) AS INTEGER) AS avg_rating,
      MIN(business_reviews.rating) AS min_rating,
      MAX(business_reviews.rating) AS max_rating,
      CAST(COUNT(dishes.id) AS INTEGER) AS dish_count,
      CAST(ROUND(AVG(dishes.price), 2) AS INTEGER) AS avg_dish_price
    FROM businesses
    LEFT JOIN business_reviews
      ON businesses.id = business_reviews.business_id
    LEFT JOIN dishes
      ON businesses.id = dishes.business_id
    WHERE businesses.is_verified = true
    GROUP BY
      businesses.id,
      businesses.owner_id,
      businesses.business_name,
      businesses.country,
      businesses.city,
      businesses.address,
      businesses.zip_code,
      businesses.business_phone,
      businesses.business_website,
      businesses.is_verified,
      businesses.created_at;
  `;

  return await executeQuery(query);
};

export const findNearbyBusinesses = async (location) => {
  const query = `
    SELECT * FROM businesses
    WHERE LOWER(city) ILIKE TRIM(LOWER($1))
  `;

  return await executeQuery(query, [`%${location}%`]);
};
