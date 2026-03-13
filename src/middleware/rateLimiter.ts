import rateLimit from "express-rate-limit";

export const translationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});
