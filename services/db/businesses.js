import { BusinessNotFoundError } from "../../errors/BusinessOwnerError.js";
import { executeQuery } from "./init.js";

export const addBusiness = async (data) => {
  const { ownerId, businessName, country, city, address, zipCode, businessPhone, businessWebsite } =
    data;

  const query = `
    INSERT INTO businesses
    (owner_id, business_name, country, city, address, zip_code, business_phone, business_website)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *; 
   `;

  const result = await executeQuery(query, [
    ownerId,
    businessName,
    country,
    city,
    address,
    zipCode,
    businessPhone,
    businessWebsite,
  ]);

  if (result.length === 0) {
    throw new BusinessNotFoundError();
  }

  return result[0];
};
