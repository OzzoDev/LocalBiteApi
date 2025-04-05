import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./routes/AuthRouter.js";
import ApiRouter from "./routes/ApiRouter.js";
import { serverSession } from "./middlewares/Session.js";
import { ensureAuthenticated } from "./middlewares/Auth.js";
import "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const openCors = cors({
  origin: (_, callback) => {
    return callback(null, true);
  },
  credentials: true,
});

app.use(openCors);
app.use(express.json());
app.use(serverSession);

app.use("/auth", AuthRouter);
app.use("/api", ensureAuthenticated, ApiRouter);

app.get("/", (_, res) => {
  res.send("Welcome to the LocalBiteApi");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
