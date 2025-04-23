import { BusinessEmailError } from "../errors/BusinessOwnerError.js";
import { validateIsBusinessOwner } from "../utils/utils.js";

export const registerBusiness = async (req, res, next) => {
  const { email } = req.user;
  const { businessName } = req.body;

  try {
    const isBusinessOwner = validateIsBusinessOwner(businessName, email);

    if (!isBusinessOwner) {
      throw new BusinessEmailError();
    }

    res.status(201).json({ message: `${businessName} registered successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};
