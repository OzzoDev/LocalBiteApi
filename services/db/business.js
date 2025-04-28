import { executeQuery } from "./init.js";

export const findBusinesses = async (requestQuery) => {
  const { search, sort, order, page = 1, limit = 10 } = requestQuery;
  const offset = (page - 1) * limit;
  const values = [];

  let query = `
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
  `;

  if (search) {
    query += `
      AND (
        business_name ILIKE $1 OR 
        country ILIKE $1 OR 
        city ILIKE $1 OR 
        address ILIKE $1 OR 
        dishes.dish_name ILIKE $1
      )
    `;
    values.push(`%${search}%`);
  }

  const allowedSortFields = [
    "business_name",
    "created_at",
    "avg_rating",
    "min_rating",
    "max_rating",
    "review_count",
  ];
  const validSort = allowedSortFields.includes(sort) ? sort : "created_at";
  const validOrder = order === "asc" ? "ASC" : "DESC";

  if (search) {
    query += ` GROUP BY businesses.id ORDER BY ${validSort} ${validOrder} LIMIT $2 OFFSET $3`;
    values.push(limit, offset);
  } else {
    query += ` GROUP BY businesses.id ORDER BY ${validSort} ${validOrder} LIMIT $1 OFFSET $2`;
    values.push(limit, offset);
  }

  return await executeQuery(query, values);
};

export const findNearbyBusinesses = async (location) => {
  const query = `
    SELECT * FROM businesses
    WHERE LOWER(city) ILIKE TRIM(LOWER($1))
  `;

  return await executeQuery(query, [`%${location}%`]);
};
