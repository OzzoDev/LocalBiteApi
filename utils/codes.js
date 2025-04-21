import crypto from "crypto";

export const generateOTP = () => crypto.randomBytes(4).toString("hex").slice(0, 8);
