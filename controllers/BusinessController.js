import { findBusinesses } from "../services/db/business.js";

export const getBusinesses = async (req, res, next) => {
  try {
    const businesses = await findBusinesses();
    res.status(200).json({ businesses, success: true });
  } catch (err) {
    next(err);
  }
};
