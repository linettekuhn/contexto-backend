import { NextFunction, Request, Response } from "express";
import z, { email } from "zod";
import sanitizeHtml from "sanitize-html";

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .check(z.email("Invalid email address"));

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters");

const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(/^\S+$/, "Name must be a single word"),
});

const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

function sanitizeString(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}

// middleware to validate register request body
export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    const { formErrors, fieldErrors } = z.flattenError(result.error);
    return res
      .status(400)
      .json({ error: "Invalid input", details: { formErrors, fieldErrors } });
  }

  req.body = {
    ...result.data,
    name: sanitizeString(result.data.name),
    email: sanitizeString(result.data.email),
  };

  next();
}

// middleware to validate login request body
export default function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const { formErrors, fieldErrors } = z.flattenError(result.error);
    return res
      .status(400)
      .json({ error: "Invalid input", details: { formErrors, fieldErrors } });
  }

  req.body = {
    ...result.data,
    email: sanitizeString(result.data.email),
  };

  next();
}
