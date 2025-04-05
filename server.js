import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import AuthRouter from "./routes/AuthRouter.js";
import "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", AuthRouter);

app.get("/", (_, res) => {
  res.send("Welcome to the LocalBiteApi");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
