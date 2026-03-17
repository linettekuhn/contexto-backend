import { vi, beforeEach, describe, it, expect } from "vitest";
import { db } from "../../db/connection";
import { refresh_tokens, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { registerUser } from "../../services/auth.service";

// reset tables befoer each test
beforeEach(async () => {
  await db.delete(refresh_tokens);
  await db.delete(users);
});

// register integration tests
describe("registerUser()", () => {
  it("inserts a new user and returns them", async () => {
    // ACT
    const user = await registerUser("test@example.com", "password123");

    // ASSERT
    expect(user.email).toBe("test@example.com");
    expect(user.id).toBeDefined();
  });

  it("stores a hashed password, not the plain one", async () => {
    // ACT
    await registerUser("test@example.com", "password123");
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, "test@example.com"));

    // ASSERT
    expect(row.password_hash).not.toBe("password123");
    expect(row.password_hash).toBeDefined();
  });

  it("throws when email is a duplicate", async () => {
    // ACT
    await registerUser("test@example.com", "password123");

    // ASSERT
    await expect(
      registerUser("test@example.com", "password456"),
    ).rejects.toThrow();
  });
});
