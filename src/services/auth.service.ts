import { eq, ne } from "drizzle-orm";
import { db } from "../db/connection";
import { refresh_tokens, users } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export async function registerUser(email: string, password: string) {
  // create password hash
  const password_hash = await hashPassword(password);

  // store in db and return stored user
  const [user] = await db
    .insert(users)
    .values({ email, password_hash })
    .returning();
  return user;
}

export async function loginUser(email: string, password: string) {
  // check if user with email exists
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("Invalid credentials");

  // verify password against user's password_hash
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  // generate tokens
  const accessToken = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  // save refresh token in db
  await db.insert(refresh_tokens).values({
    user_id: user.id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // return tokens and user
  return { refreshToken, accessToken, user };
}

export async function refreshToken(oldToken: string) {
  // check if token exists in tokens table
  const [tokenRecord] = await db
    .select()
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token, oldToken));

  if (!tokenRecord) throw new Error("Invalid refresh token");

  // generate new tokens
  const newAccessToken = generateAccessToken(tokenRecord.user_id);
  const newRefreshToken = generateRefreshToken(tokenRecord.user_id);

  // get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, tokenRecord.user_id));

  if (!user) throw new Error("User not found");

  // delete old refresh token
  await db.delete(refresh_tokens).where(eq(refresh_tokens.id, tokenRecord.id));

  // save new refresh token
  await db.insert(refresh_tokens).values({
    user_id: tokenRecord.user_id,
    token: newRefreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    newAccessToken,
    newRefreshToken,
    user: {
      email: user.email,
    },
  };
}
