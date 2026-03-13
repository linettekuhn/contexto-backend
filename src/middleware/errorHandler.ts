import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
}
