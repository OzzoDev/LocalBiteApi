import { MenuNotFoundError } from "../../errors/ResourceErrors.js";
import { executeQuery } from "./init.js";

export const findDishes = async () => {
  const query = `
    SELECT * FROM dishes; 
  `;

  return await executeQuery(query);
};

export const findMenu = async (businessId) => {
  const query = `
    SELECT 
      JSON_AGG(dish_data ORDER BY dish_data.avg_rating DESC) AS menu
    FROM (
      SELECT 
        dishes.dish_name,
        dishes.description,
        dishes.price,
        ROUND(AVG(dish_reviews.rating), 2) AS avg_rating,
        MIN(dish_reviews.rating) AS min_rating,
        MAX(dish_reviews.rating) AS max_rating,
        COUNT(dish_reviews.id) AS review_count
      FROM dishes
      LEFT JOIN dish_reviews
        ON dishes.id = dish_reviews.dish_id
      WHERE dishes.business_id = $1
      GROUP BY dishes.id
    ) AS dish_data
  `;

  const result = await executeQuery(query, [parseInt(businessId, 10)]);

  if (!result[0] || !result[0].menu) {
    throw new MenuNotFoundError();
  }

  return result[0].menu;
};
