import { beforeEach, describe, expect, it } from "vitest";
import {
  getUserHistory,
  deleteHistoryEntry,
} from "../../services/history.service";
import { db } from "../../db/connection";
import { translations, users, refresh_tokens } from "../../db/schema";

let testUserId: number;
let otherUserId: number;

beforeEach(async () => {
  await db.delete(translations);
  await db.delete(refresh_tokens);
  await db.delete(users);

  const [user] = await db
    .insert(users)
    .values({ email: "history-test@example.com", password_hash: "fakehash" })
    .returning();
  testUserId = user.id;

  const [other] = await db
    .insert(users)
    .values({ email: "history-other@example.com", password_hash: "fakehash" })
    .returning();
  otherUserId = other.id;
});

// seed helper
async function insertTranslation(userId: number | null, overrides = {}) {
  const [row] = await db
    .insert(translations)
    .values({
      original_text: "Hello",
      translated_text: "Hola",
      source_language: "English",
      target_language: "Spanish",
      dialect: "Mexican",
      user_id: userId,
      ...overrides,
    })
    .returning();
  return row;
}

describe("getUserHistory()", () => {
  it("returns only translations belonging to the user", async () => {
    await insertTranslation(testUserId);
    await insertTranslation(otherUserId); // should not appear

    const history = await getUserHistory(testUserId);

    expect(history).toHaveLength(1);
    expect(history[0].user_id).toBe(testUserId);
  });

  it("returns results ordered by created_at descending", async () => {
    const first = await insertTranslation(testUserId, {
      original_text: "First",
    });
    const second = await insertTranslation(testUserId, {
      original_text: "Second",
    });

    const history = await getUserHistory(testUserId);

    // most recent insert should come first
    expect(history[0].id).toBe(second.id);
    expect(history[1].id).toBe(first.id);
  });

  it("respects limit and offset", async () => {
    await insertTranslation(testUserId, { original_text: "A" });
    await insertTranslation(testUserId, { original_text: "B" });
    await insertTranslation(testUserId, { original_text: "C" });

    const page1 = await getUserHistory(testUserId, 2, 0);
    const page2 = await getUserHistory(testUserId, 2, 2);

    expect(page1).toHaveLength(2);
    expect(page2).toHaveLength(1);
  });

  it("returns empty array when user has no translations", async () => {
    const history = await getUserHistory(testUserId);
    expect(history).toHaveLength(0);
  });
});

describe("deleteHistoryEntry()", () => {
  it("deletes the correct entry", async () => {
    const row = await insertTranslation(testUserId);

    await deleteHistoryEntry(row.id, testUserId);

    const remaining = await getUserHistory(testUserId);
    expect(remaining).toHaveLength(0);
  });

  it("does not delete entries belonging to another user", async () => {
    const otherRow = await insertTranslation(otherUserId);

    await deleteHistoryEntry(otherRow.id, testUserId); // wrong user

    const rows = await db.select().from(translations);
    expect(rows).toHaveLength(1); // other user's row should still exist
  });
});
