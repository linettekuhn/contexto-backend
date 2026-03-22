import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: { id: number };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token, env.JWT_SECRET);
    req.user = { id: payload.userId };

    next();
  } catch (error) {
    next(error);
  }
}
