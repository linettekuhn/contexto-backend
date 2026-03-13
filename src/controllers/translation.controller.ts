import { Request, Response } from "express";
import { translateText } from "../services/translation.service";

export async function translateController(req: Request, res: Response) {
  try {
    const result = await translateText(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
}
