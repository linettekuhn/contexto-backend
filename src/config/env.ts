export const env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT || 5000,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
};
