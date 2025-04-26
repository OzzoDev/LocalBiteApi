import { findDish } from "../services/db/dishes.js";

export const ensureDishExists = async (req, res, next) => {
  const { dishid: dishId } = req.params;

  try {
    await findDish(dishId);
  } catch (err) {
    next(err);
  }
};
