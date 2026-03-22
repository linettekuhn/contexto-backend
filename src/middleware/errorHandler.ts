import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import z from "zod";
import { AppError } from "../utils/AppError";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(error);

  // zod error
  if (error instanceof z.ZodError) {
    const { formErrors, fieldErrors } = z.flattenError(error);
    return res.status(400).json({
      error: "Invalid input",
      details: { formErrors, fieldErrors },
    });
  }

  // app error
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  // unknown error
  res.status(500).json({
    error: "Internal server error",
  });
}
