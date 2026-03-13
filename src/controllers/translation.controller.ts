import { NextFunction, Request, Response } from "express";
import { translateText } from "../services/translation.service";

export async function translateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await translateText(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
