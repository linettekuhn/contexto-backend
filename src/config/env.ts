import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
};
