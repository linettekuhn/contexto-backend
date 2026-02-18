import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testConnection from "./db/test-connection";
import testInsert from "./db/test-translation";
import translateRouter from "./routes/translate";
import rateLimit from "express-rate-limit";

// rate limiting to 100 requests per IP per 15 minute window
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100,
});

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/translate", limiter, translateRouter);

app.get("/", (req, res) => {
  res.send("Contexto backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Contexto API running on port ${PORT}`);
  testConnection();
});
