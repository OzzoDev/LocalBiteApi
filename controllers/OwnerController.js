import { addBusiness, deleteBusiness, findBusinesses } from "../services/db/owner.js";
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
  const { businessid: businessId, deletecommand: deleteCommand } = req.params;
  const { id: ownerId } = req.user;

  try {
    await deleteBusiness(businessId, ownerId, deleteCommand);

    res
      .status(200)
      .json({ message: `Business with id '${businessId}' deleted successfully`, success: true });
  } catch (err) {
    next(err);
  }
};

export const getBusinesses = async (req, res, next) => {
  const { id: ownerId } = req.user;

  try {
    const businesses = await findBusinesses(ownerId);
    res.status(200).json({ businesses, success: true });
  } catch (err) {
    next(err);
  }
};
