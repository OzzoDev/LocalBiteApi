import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_CONNECT;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Mongodb connect");
  })
  .catch((err) => {
    console.log("Mongodb connection error: ", err);
  });
