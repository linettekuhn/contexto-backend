import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { translations } from "../db/schema";

export const getUserHistory = async (
  userId: number,
  limit = 20,
  offset = 0,
) => {
  return db
    .select()
    .from(translations)
    .where(eq(translations.user_id, userId))
    .orderBy(desc(translations.created_at))
    .limit(limit)
    .offset(offset);
};

export const deleteHistoryEntry = async (
  translationId: number,
  userId: number,
) => {
  return db
    .delete(translations)
    .where(
      and(eq(translations.id, translationId), eq(translations.user_id, userId)),
    );
};
