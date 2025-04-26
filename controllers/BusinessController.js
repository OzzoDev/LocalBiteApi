import axios from "axios";
import { findBusinesses } from "../services/db/business.js";
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

  console.log(req.query, latitude, longitude);

  if (!latitude || !longitude) {
    return res.send("Stop");
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    if (!response.data || !response.data.address) {
      return next(new LocationNotFoundError());
    }

    const address = response.data.address;
    const location = address.city || address.town || address.village;

    res.status(200).json({ location, success: true });
  } catch (err) {
    next(err);
  }
};
