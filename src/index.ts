import express from "express";
import cors from "cors";
import testConnection from "./db/test-connection";
import translateRouter from "./routes/translate.routes";
import authRouter from "./routes/auth.routes";
import historyRouter from "./routes/history.routes";
import { translationLimiter } from "./middleware/rateLimiter";
import { env } from "./config/env";
import { requestLogger, responseBodyLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";

const app = express();

// middleware
app.use(cookieParser());
app.use(requestLogger);
app.use(responseBodyLogger);
app.use(
  cors({
    origin: env.ALLOWED_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

// translation router
app.use("/translate", translationLimiter, translateRouter);

// auth router
app.use("/auth", authRouter);

// history router
app.use("/history", historyRouter);

// error middleware (last)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Contexto backend is running");
});

app.get("/test", (req, res) => {
  testConnection();
  res.send("Testing");
});

app.listen(env.PORT, () => {
  console.log(`Contexto API running on port ${env.PORT}`);
});
