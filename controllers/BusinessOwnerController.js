import { BusinessEmailError } from "../errors/BusinessOwnerError.js";
import { isCloseMatch } from "../utils/utils.js";

export const registerBusiness = async (req, res, next) => {
  const { email } = req.user;
  const { businessName } = req.body;

  try {
    const isBusinessOwner = isCloseMatch(
      businessName,
      email ? email.split("@")[1].split(".")[0] : ""
    );

    if (!isBusinessOwner) {
      throw new BusinessEmailError();
    }

    res.status(201).json({ message: `${businessName} registered successfuly`, success: true });
  } catch (err) {
    next(err);
  }
};
