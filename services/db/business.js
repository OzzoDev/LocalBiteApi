import { executeQuery } from "./init.js";

export const findBusinesses = async () => {
  const query = `
    SELECT 
      businesses.id AS business_id,
      businesses.owner_id AS owner_id,
      businesses.business_name AS business_name,
      businesses.country AS country,
      businesses.city AS city,
      businesses.address AS address,
      businesses.zip_code AS zip_code,
      businesses.business_phone AS business_phone,
      businesses.business_website AS business_website,
      businesses.is_verified AS is_verified,
      businesses.created_at AS created_at,
      CAST(COUNT(business_reviews.review) AS INTEGER) AS review_count,
      ROUND(AVG(business_reviews.rating), 2) AS avg_rating,
      MIN(business_reviews.rating) AS min_rating,
      MAX(business_reviews.rating) AS max_rating
    FROM businesses
    LEFT JOIN business_reviews
    ON businesses.id = business_reviews.business_id
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

  const businesses = await executeQuery("SELECT * FROM businesses");
  const businessReviews = await executeQuery("SELECT * FROM business_reviews");

  console.log("Businesses: ", businesses);
  console.log("BusinessReviews: ", businessReviews);

  return await executeQuery(query);
};

export const findNearbyBusinesses = async (location) => {
  const query = `
    SELECT * FROM businesses
    WHERE LOWER(city) ILIKE TRIM(LOWER($1))
  `;

  return await executeQuery(query, [`%${location}%`]);
};
