import "./config/loadEnv.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/AuthRouter.js";
import ApiRouter from "./routes/ApiRouter.js";
import { serverSession } from "./middlewares/Session.js";
import { authenticate } from "./middlewares/Auth.js";
import "./config/mongodb.js";
import "./config/postgres.js";

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(serverSession);

app.use("/auth", AuthRouter);
app.use("/api", authenticate, ApiRouter);

app.get("/", (_, res) => {
  res.send("Welcome to the LocalBiteApi");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
