import { findDishes, findMenu } from "../services/db/dish.js";

export const getDishes = async (req, res, next) => {
  try {
    const dishes = await findDishes();
    res.status(200).json({ dishes, success: true });
  } catch (err) {
    next(err);
  }
};

export const getMenu = async (req, res, next) => {
  const { businessid: businessId } = req.params;

  try {
    const menu = await findMenu(businessId);
    res.status(200).json({ menu, success: true });
  } catch (err) {
    next(err);
  }
};
