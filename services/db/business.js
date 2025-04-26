import { executeQuery } from "./init.js";

export const findBusinesses = async () => {
  const query = `
    SELECT * FROM businesses; 
  `;

  return await executeQuery(query);
};

export const findNearbyBusinesses = async (location) => {
  const query = `
    SELECT * FROM businesses
    WHERE LOWER(city) = TRIM(LOWER($1))
  `;

  return await executeQuery(query, [location]);
};
