import { addBusiness } from "../services/db/businesses.js";
import { updateUserRole } from "../services/db/users.js";

export const registerBusiness = async (req, res, next) => {
  const { id: userId } = req.user;
  const businessData = { ...req.body, ownerId: userId };

  try {
    await addBusiness(businessData);

    await updateUserRole(userId, "unverified_owner");

    res
      .status(201)
      .json({ message: `${req.body.businessName} registered successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};

export const unregisterBusiness = async (req, res, next) => {
  try {
    //
  } catch (err) {
    next(err);
  }
};
