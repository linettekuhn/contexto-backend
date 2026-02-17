import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testConnection from "./db/test-connection";
import testInsert from "./db/test-translation";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Contexto backend is running");
  testInsert();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Contexto API running on port ${PORT}`);
  testConnection();
});
