import { findBusinesses } from "../services/db/business.js";
import { getLocation } from "../utils/utils.js";

export const getBusinesses = async (req, res, next) => {
  const { lat: latitude, lon: longitude } = req.query;

  try {
    const location = await getLocation(latitude, longitude);

    const businesses = await findBusinesses(req.query, location || "");
    res.status(200).json({ businesses, success: true });
  } catch (err) {
    next(err);
  }
};
