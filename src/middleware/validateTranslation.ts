import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const translationSchema = z.object({
  original_text: z
    .string()
    .trim()
    .min(1, "Text cannot be empty")
    .max(500, "Text must be under 1500 characters"),
  source_language: z.string().trim().min(1),
  target_language: z.string().trim().min(1),
  dialect: z.string().trim().min(1),
});

// middleware to validate translation request body
const validateTranslation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = translationSchema.safeParse(req.body);

  if (!result.success) {
    const { formErrors, fieldErrors } = z.flattenError(result.error);

    return res.status(400).json({
      error: "Invalid input",
      details: {
        formErrors,
        fieldErrors,
      },
    });
  }

  // sanitize text
  const cleanText = sanitizeHtml(result.data.original_text, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // replace body with cleaned data
  req.body = {
    ...result.data,
    original_text: cleanText,
  };

  next();
};

export default validateTranslation;
