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
  const { businessid: businessId } = req.params;

  try {
    await addDish({ ...req.body, businessId: parseInt(businessId, 10) });

    res.status(201).json({ message: `${req.body.dishName} added successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};
