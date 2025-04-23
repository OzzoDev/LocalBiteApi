import jwt from "jsonwebtoken";
import { findUser, invalidateTokens } from "../db/users.js";

const JWT_SECRET = process.env.JWT_SECRET;

const signJwt = async (userData) => {
  const user = await findUser(userData);
  const { username, email, id } = user;

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
