import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { randomUUID } from "crypto";

export function generateAccessToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: number) {
  return jwt.sign({ userId, jti: randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret) as { userId: number };
}
