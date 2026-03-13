import express from "express";
import cors from "cors";
import testConnection from "./db/test-connection";
import translateRouter from "./routes/translate.routes";
import { translationLimiter } from "./middleware/rateLimiter";
import { env } from "./config/env";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/translate", translationLimiter, translateRouter);

app.get("/", (req, res) => {
  res.send("Contexto backend is running");
});

app.listen(env.PORT, () => {
  console.log(`Contexto API running on port ${env.PORT}`);
  testConnection();
});
