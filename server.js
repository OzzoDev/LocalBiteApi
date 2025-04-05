import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import AuthRouter from "./routes/AuthRouter.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const SESSION_KEY = process.env.SESSION_KEY;
const MONGO_URI = process.env.MONGO_CONNECT;

app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
    cookie: { httpOnly: true, secure: false }, // Set secure: true in production
  })
);

//how to use
//req.session.jwt = jwt

app.use("/auth", AuthRouter);

app.get("/", (_, res) => {
  res.send("Welcome to the LocalBiteApi");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
