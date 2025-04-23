import jwt from "jsonwebtoken";
import { invalidateTokens } from "../db/users";

const JWT_SECRET = process.env.JWT_SECRET;

const signJwt = async (userData) => {
  const { username, email, id } = userData;

  const newJwtVersion = await invalidateTokens(id);

  const token = jwt.sign({ username, email, id, version: newJwtVersion }, JWT_SECRET, {
    expiresIn: "1y",
  });

  return token;
};

export const signAndStroreJwt = async (userData, req) => {
  const token = await signJwt(userData);
  req.session.jwt = token;
};
