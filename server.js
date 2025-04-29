import "./config/loadEnv.js";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import AuthRouter from "./routes/AuthRouter.js";
import ApiRouter from "./routes/ApiRouter.js";
import OwnerRouter from "./routes/OwnerRouter.js";
import swaggerUi from "swagger-ui-express";
import { serverSession, rotateSession } from "./middlewares/Session.js";
import { authenticate, ensureIsVerified } from "./middlewares/Auth.js";
import "./config/mongodb.js";
import "./config/postgres.js";
import { errorHandler, notFoundHandler } from "./middlewares/ErrorHandler.js";
import { swaggerDocs } from "./config/swagger.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(corsOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(serverSession);
app.use(rotateSession);

app.use("/auth", AuthRouter);
app.use("/owner", authenticate, ensureIsVerified, OwnerRouter);
app.use("/api", authenticate, ensureIsVerified, ApiRouter);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
