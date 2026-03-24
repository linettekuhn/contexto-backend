import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as historyService from "../services/history.service";

export const getHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // set by authMiddleware
    const userId = req.user!.id;

    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const history = await historyService.getUserHistory(userId, limit, offset);
    res.json({ history });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // set by authMiddleware
    const userId = req.user!.id;
    const translationId = parseInt(req.params.id as string, 10);

    if (isNaN(translationId)) {
      res.status(400).json({ error: "Invalid translation ID" });
      return;
    }

    await historyService.deleteHistoryEntry(translationId, userId);
    res.json({ message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
};
