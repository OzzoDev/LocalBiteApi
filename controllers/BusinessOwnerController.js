import {
  addBusiness,
  addDish,
  deleteDish,
  findBusinessDish,
  findBusinessDishes,
  findDish,
  findDishes,
  updateDish,
} from "../services/db/businesses.js";

export const registerBusiness = async (req, res, next) => {
  const businessData = { ...req.body, ownerId: req.user.id };

  try {
    await addBusiness(businessData);

    res
      .status(201)
      .json({ message: `${req.body.businessName} registered successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};

export const getDish = async (req, res, next) => {
  const { businessid: businessId, dishid: dishId } = req.params;
  const { id: ownerId } = req.user;

  try {
    const dish = await findBusinessDish({ businessId, dishId, ownerId });

    res.status(200).json({
      dish: { dish_name: dish.dish_name, description: dish.description, price: dish.price },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getDishes = async (req, res, next) => {
  const { businessid: businessId } = req.params;
  const { id: ownerId } = req.user;

  try {
    const dishes = await findBusinessDishes({ businessId, ownerId });
    res.status(200).json({ dishes, success: true });
  } catch (err) {
    next(err);
  }
};

export const appendDish = async (req, res, next) => {
  const { businessid: businessId } = req.params;

  try {
    await addDish({ ...req.body, businessId: parseInt(businessId, 10) });

    res.status(201).json({ message: `${req.body.dishName} added successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};

export const removeDish = async (req, res, next) => {
  const { businessid: businessId, dishid: dishId } = req.params;
  const { id: ownerId } = req.user;

  try {
    await deleteDish({ businessId, dishId, ownerId });

    res.status(200).json({ message: `Dish with id ${dishId} deleted successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};

export const alterDish = async (req, res, next) => {
  const { businessid: businessId, dishid: dishId } = req.params;
  const { id: ownerId } = req.user;

  try {
    await updateDish({ businessId, dishId, ownerId, ...req.body });

    res.status(200).json({ message: `Dish with id ${dishId} updated successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};
