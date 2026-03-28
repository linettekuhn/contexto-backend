import pinoHttp from "pino-http";
import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

export const requestLogger = pinoHttp({ logger });

export function responseBodyLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    logger.info({ url: req.url, responseBody: body }, "response body");
    return originalJson(body);
  };
  next();
}
