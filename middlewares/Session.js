import session from "express-session";
import MongoStore from "connect-mongo";

const SESSION_KEY = process.env.SESSION_KEY;
const MONGO_URI = process.env.MONGO_CONNECT;
const isProd = process.env.NODE_ENV === "production";

export const serverSession = session({
  secret: SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    ttl: 365 * 24 * 60 * 60,
  }),
  cookie: {
    httpOnly: true,
    secure: isProd,
    maxAge: 365 * 24 * 60 * 60 * 1000,
    sameSite: "Strict",
  },
});
