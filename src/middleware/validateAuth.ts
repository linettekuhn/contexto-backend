import { NextFunction, Request, Response } from "express";
import z, { email } from "zod";
import sanitizeHtml from "sanitize-html";

const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .check(z.email("Invalid email address")),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters"),
});

// middleware to validate auth request body
export default function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = authSchema.safeParse(req.body);

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

  // sanitize email
  const cleanEmail = sanitizeHtml(result.data.email, {
    allowedTags: [],
    allowedAttributes: {},
  });

  // replace body with cleaned data
  req.body = {
    ...result.data,
    email: cleanEmail,
  };

  next();
}
