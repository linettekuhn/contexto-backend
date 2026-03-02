import { OpenAI } from "openai";
import express from "express";
import { error } from "node:console";
import { db } from "../db/connection";
import { translations } from "../db/schema";
import validateTranslation from "../middleware/validateTranslation";

const router = express.Router();

// chatgpt api instance
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// translate endpoint
router.post("/", validateTranslation, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing request body" });
    }
    const { original_text, source_language, target_language, dialect } =
      req.body;

    if (!original_text || !target_language || !dialect || !source_language) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (original_text.length > 500) {
      return res.status(400).json({ error: "Text too long" });
    }

    // call GPT-4o mini to translate
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert translator specializing in ${dialect} dialect as spoken by native speakers in ${target_language}. 
            Translate the following text in ${source_language} into authentic ${dialect} ${target_language}. Use:
            - Contemporary colloquial expressions and slang
            - Natural grammar patterns specific to this dialect
            - Local idioms and phrases
            - The rhythm and flow of everyday speech

            Output ONLY the translated text with no explanations, notes, or additional commentary.`,
        },
        {
          role: "user",
          content: original_text,
        },
      ],
    });

    const translated_text = response.choices[0].message.content?.trim();

    if (!translated_text) {
      return res.status(500).json({ error: "Failed to generate translation" });
    }

    // save translation to database
    const inserted = await db
      .insert(translations)
      .values({
        original_text,
        translated_text,
        source_language,
        target_language,
        dialect,
      })
      .returning();

    res.json({
      translation: translated_text,
      db_record: inserted[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
