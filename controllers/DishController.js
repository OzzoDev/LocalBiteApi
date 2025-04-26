import { findDishes } from "../services/db/dish.js";

export const getDishes = async (req, res, next) => {
  try {
    const dishes = await findDishes();
    res.status(200).json({ dishes, success: true });
  } catch (err) {
    next(err);
  }
};
