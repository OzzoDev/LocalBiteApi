import { signOwnerJwt } from "../services/auth/jwt.js";
import { addBusiness, addDish } from "../services/db/businesses.js";

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

export const appendDish = async (req, res, next) => {
  try {
    await addDish(req.body);

    res.status(201).json({ message: `${req.body.dishName} added successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};
