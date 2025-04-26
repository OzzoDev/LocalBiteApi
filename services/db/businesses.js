import {
  BusinessNotFoundError,
  DeleteBusinessError,
  NotOwnerError,
} from "../../errors/BusinessOwnerError.js";
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

export const deleteBusiness = async (businessId, ownerId, deleteCommand = "") => {
  const business = await findBusiness(businessId);

  if (!business) {
    throw new BusinessNotFoundError();
  }

  if (business.owner_id !== parseInt(ownerId, 10)) {
    throw new NotOwnerError();
  }

  const [key, businessName] = deleteCommand.split(" ");

  if (
    key.toLowerCase() !== "delete" ||
    businessName.toLowerCase() !== business.business_name.toLowerCase()
  ) {
    throw new DeleteBusinessError();
  }

  const query = `
    DELETE FROM businesses
    WHERE id = $1
  `;

  return await executeQuery(query, [parseInt(businessId, 10)]);
};

export const findBusinesses = async (ownerId) => {
  const query = `
    SELECT * FROM businesses
    WHERE id = $1
  `;
  return await executeQuery(query, [parseInt(ownerId, 10)]);
};

export const findBusiness = async (businessId) => {
  const query = `
    SELECT * FROM businesses
    WHERE id = $1
  `;

  const result = await executeQuery(query, [parseInt(businessId, 10)]);

  if (result.length === 0) {
    throw new BusinessNotFoundError(`Business with id '${businessId}' not found`);
  }

  return result[0];
};
