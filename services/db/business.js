import { executeQuery } from "./init.js";

export const findBusinesses = async () => {
  const query = `
    SELECT * FROM businesses; 
  `;

  return await executeQuery(query);
};
