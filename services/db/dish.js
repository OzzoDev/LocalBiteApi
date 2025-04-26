import { executeQuery } from "./init.js";

export const findDishes = async () => {
  const query = `
    SELECT * FROM dishes; 
  `;

  return await executeQuery(query);
};
