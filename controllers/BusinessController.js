import axios from "axios";
import { findBusinesses, findNearbyBusinesses } from "../services/db/business.js";
import { LocationNotFoundError } from "../errors/ResourceErrors.js";

export const getBusinesses = async (req, res, next) => {
  try {
    const businesses = await findBusinesses();
    res.status(200).json({ businesses, success: true });
  } catch (err) {
    next(err);
  }
};

export const getNearbyBusinesses = async (req, res, next) => {
  const { lat: latitude, lon: longitude } = req.query;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    if (!response.data || !response.data.address) {
      return next(new LocationNotFoundError());
    }

    const address = response.data.address;
    const location = address.city || address.town || address.village;

    const businesses = await findNearbyBusinesses(location);

    res.status(200).json({ businesses, success: true });
  } catch (err) {
    next(err);
  }
};
