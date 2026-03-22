import { openai } from "../utils/openaiClient";
import { db } from "../db/connection";
import { translations } from "../db/schema";
import { TranslationRequest } from "../types/translation.types";
import { AppError } from "../utils/AppError";

export async function translateText(data: TranslationRequest, userId?: number) {
  const {
    original_text,
    source_language,
    target_language,
    dialect,
    formality,
  } = data;

  let formalityText = "";

  if (formality <= 0.33) {
    formalityText = "Use formal grammar and standard expressions.";
  } else if (formality <= 0.66) {
    formalityText = "Use natural everyday speech.";
  } else {
    formalityText =
      "Use heavy slang, informal speech, and dialect-specific expressions.";
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert translator specializing in ${dialect} dialect as spoken by native speakers in ${target_language}.
Translate the following text in ${source_language} into authentic ${dialect} ${target_language}. Use:
${formalityText}

Output ONLY the translated text.`,
      },
      {
        role: "user",
        content: original_text,
      },
    ],
  });

  const translated_text = response.choices[0].message.content?.trim();

  if (!translated_text) {
    throw new AppError(500, "Translation failed");
  }

  const inserted = await db
    .insert(translations)
    .values({
      original_text,
      translated_text,
      source_language,
      target_language,
      dialect,
      user_id: userId ?? null,
    })
    .returning();

  return {
    translation: translated_text,
    db_record: inserted[0],
  };
}
