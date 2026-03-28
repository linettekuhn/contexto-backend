import express, { NextFunction, Response } from "express";
import validateTranslation from "../middleware/validateTranslation";
import { translateController } from "../controllers/translation.controller";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  // if no token provided just skip
  if (!authHeader) return next();
  // validate token if present
  return authMiddleware(req, res, next);
}

router.post("/", optionalAuth, validateTranslation, translateController);

export default router;
