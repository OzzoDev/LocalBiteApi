import { addBusiness } from "../services/db/businesses.js";

export const registerBusiness = async (req, res, next) => {
  try {
    const businessData = { ...req.body, ownerId: req.user.id };

    await addBusiness(businessData);

    res
      .status(201)
      .json({ message: `${req.body.businessName} registered successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};
