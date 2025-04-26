import { findBusiness } from "../services/db/businesses.js";
import { findDish } from "../services/db/dishes.js";

export const ensureDishExists = async (req, res, next) => {
  const { dishid: dishId } = req.params;

  try {
    await findDish(dishId);
    next();
  } catch (err) {
    next(err);
  }
};

export const ensureBusinessExists = async (req, res, next) => {
  const { businessid: businessId } = req.params;

  try {
    await findBusiness(businessId);
    next();
  } catch (err) {
    next(err);
  }
};
