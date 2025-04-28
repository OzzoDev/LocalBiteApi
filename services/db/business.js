import { BusinessNotFoundError } from "../../errors/BusinessOwnerError.js";
import { executeQuery } from "./init.js";

export const findBusinesses = async (requestQuery, location = "") => {
  const { search, sort, order, page = 1, limit = 10 } = requestQuery;
  const offset = (page - 1) * limit;
  const params = [];
  const whereConditions = ["businesses.is_verified = true AND users.role = 'owner'"];

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
      CAST(COUNT(DISTINCT business_reviews.id) AS INTEGER) AS review_count,
      CAST(ROUND(AVG(business_reviews.rating), 2) AS INTEGER) AS avg_rating,
      MIN(business_reviews.rating) AS min_rating,
      MAX(business_reviews.rating) AS max_rating,
      CAST(COUNT(DISTINCT dishes.id) AS INTEGER) AS dish_count,
      CAST(ROUND(AVG(dishes.price), 2) AS INTEGER) AS avg_dish_price
    FROM businesses
    LEFT JOIN business_reviews 
      ON businesses.id = business_reviews.business_id
    LEFT JOIN dishes 
      ON businesses.id = dishes.business_id
    LEFT JOIN users
      ON users.id = businesses.owner_id
`;

  if (search) {
    whereConditions.push(`
      (
        businesses.business_name ILIKE $${params.length + 1} OR 
        businesses.country ILIKE $${params.length + 1} OR 
        businesses.city ILIKE $${params.length + 1} OR 
        businesses.address ILIKE $${params.length + 1} OR 
        dishes.dish_name ILIKE $${params.length + 1}
      )
    `);
    params.push(`%${search}%`);
  }

  if (location) {
    whereConditions.push(`businesses.city ILIKE $${params.length + 1}`);
    params.push(`%${location}%`);
  }

  if (whereConditions.length > 0) {
    query += ` WHERE ` + whereConditions.join(" AND ");
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

  query += ` GROUP BY businesses.id ORDER BY ${validSort} ${validOrder} LIMIT $${
    params.length + 1
  } OFFSET $${params.length + 2}`;

  params.push(limit, offset);

  return await executeQuery(query, params);
};

export const findBusinessById = async (businessid) => {
  const query = `
    SELECT 
      businesses.id AS id,
      businesses.business_name AS business_name,
      businesses.country AS country,
      businesses.city AS city,
      businesses.address AS address,
      businesses.zip_code AS zip_code,
      businesses.business_phone AS business_phone,
      businesses.business_website AS business_website,
      businesses.created_at AS created_at,
      CAST(COUNT(DISTINCT business_reviews.id) AS INTEGER) AS review_count,
      CAST(ROUND(AVG(business_reviews.rating), 2) AS INTEGER) AS avg_rating,
      MIN(business_reviews.rating) AS min_rating,
      MAX(business_reviews.rating) AS max_rating,
      CAST(COUNT(DISTINCT dishes.id) AS INTEGER) AS dish_count,
      CAST(ROUND(AVG(dishes.price), 2) AS INTEGER) AS avg_dish_price
    FROM businesses
    LEFT JOIN business_reviews 
      ON businesses.id = business_reviews.business_id
    LEFT JOIN dishes 
      ON businesses.id = dishes.business_id
    LEFT JOIN users
      ON users.id = businesses.owner_id
    WHERE businesses.id = $1 AND businesses.is_verified = true AND users.role = 'owner'
    GROUP BY businesses.id
  `;

  const result = await executeQuery(query, [businessid]);

  if (result.length === 0) {
    throw new BusinessNotFoundError();
  }

  return result[0];
};
