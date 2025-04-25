import {
  BusinessNotFoundError,
  DishNotFoundError,
  NotOwnerError,
  UpdateError,
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

export const deleteDish = async (data) => {
  const { businessId, dishId, ownerId } = data;

  const business = await findBusiness(businessId);

  if (business.owner_id !== parseInt(ownerId, 10)) {
    throw new NotOwnerError();
  }

  await findDish(dishId);

  const query = `
    DELETE FROM dishes
    WHERE business_id = $1 AND id = $2
   `;

  return await executeQuery(query, [parseInt(businessId, 10), parseInt(dishId, 10)]);
};

export const updateDish = async (data) => {
  const { businessId, dishId, ownerId, dishName, description, price } = data;

  const business = await findBusiness(businessId);
  if (business.owner_id !== parseInt(ownerId, 10)) {
    throw new NotOwnerError();
  }

  await findDish(dishId);

  const fieldsToUpdate = {
    ...(dishName !== undefined && { dish_name: dishName }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price }),
  };

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new UpdateError();
  }

  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");

  const query = `
      UPDATE dishes
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

  values.push(parseInt(dishId, 10));

  return await executeQuery(query, values);
};

export const findDish = async (dishId) => {
  const query = `
    SELECT * FROM dishes
    WHERE id = $1
  `;

  const result = await executeQuery(query, [parseInt(dishId, 10)]);

  if (result.length === 0) {
    throw new DishNotFoundError();
  }

  return result[0];
};

export const findBusinessDish = async (data) => {
  const { businessId, dishId, ownerId } = data;

  const business = await findBusiness(businessId);

  if (business.owner_id !== parseInt(ownerId, 10)) {
    throw new NotOwnerError();
  }

  const query = `
      SELECT * FROM dishes
      WHERE business_id = $1 AND id = $2
    `;

  const result = await executeQuery(query, [parseInt(businessId, 10), parseInt(dishId, 10)]);

  if (result.length === 0) {
    throw new DishNotFoundError();
  }

  return result[0];
};

export const findDishes = async () => {
  const query = `
    SELECT id, dish_name, description, price FROM dishes
  `;

  return await executeQuery(query);
};

export const findBusinessDishes = async (data) => {
  const { businessId, ownerId } = data;

  const business = await findBusiness(businessId);
  if (business.owner_id !== parseInt(ownerId, 10)) {
    throw new NotOwnerError();
  }

  const query = `
    SELECT id, dish_name, description, price FROM dishes
    WHERE business_id = $1
  `;

  return await executeQuery(query, [parseInt(businessId, 10)]);
};

export const findBusiness = async (businessId) => {
  const query = `
    SELECT * FROM businesses
    WHERE id = $1
  `;

  const result = await executeQuery(query, [parseInt(businessId, 10)]);

  if (result.length === 0) {
    throw new BusinessNotFoundError();
  }

  return result[0];
};
