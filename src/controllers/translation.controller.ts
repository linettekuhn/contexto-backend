import { NextFunction, Request, Response } from "express";
import { translateText } from "../services/translation.service";
import { AuthRequest } from "../middleware/authMiddleware";

export async function translateController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await translateText(req.body, req.user?.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
