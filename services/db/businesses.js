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

export const addDish = async (data) => {
  const { dishName, description, price, businessId } = data;

  await findBusiness(businessId);

  const query = `
    INSERT INTO dishes (dish_name, description, price, business_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const result = await executeQuery(query, [dishName, description, price, businessId]);

  return result;
};

export const findBusiness = async (businessId) => {
  const query = `
        SELCET * FROM businesses
        WHERE id = $1
    `;

  const result = await executeQuery(query, [businessId]);

  if (result.length === 0) {
    throw new BusinessNotFoundError();
  }

  return result[0];
};
