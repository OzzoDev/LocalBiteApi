import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const signJwt = (data) => {
  const token = jwt.sign(data, JWT_SECRET, {
    expiresIn: "1y",
  });

  return token;
};

export const setJwt = (data, req) => {
  const token = signJwt(data);
  req.session.jwt = token;
};
