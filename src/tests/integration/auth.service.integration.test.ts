import { vi, beforeEach, describe, it, expect } from "vitest";
import { db } from "../../db/connection";
import { refresh_tokens, translations, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  loginUser,
  refreshToken,
  registerUser,
} from "../../services/auth.service";

// reset tables befoer each test
beforeEach(async () => {
  await db.delete(translations);
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

// login integration tests
describe("loginUser()", () => {
  beforeEach(async () => {
    await registerUser("test@example.com", "password123");
  });

  it("returns accessToken, refreshToken, and user on valid credentials", async () => {
    // ACT
    const result = await loginUser("test@example.com", "password123");

    // ASSERT
    expect(result.user.email).toBe("test@example.com");
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it("saves the refresh token to the DB", async () => {
    // ACT
    const result = await loginUser("test@example.com", "password123");
    const [row] = await db
      .select()
      .from(refresh_tokens)
      .where(eq(refresh_tokens.token, result.refreshToken));

    // ASSERT
    expect(row.user_id).toBe(result.user.id);
    expect(row).toBeDefined();
  });

  it("throws Invalid credentials for wrong password", async () => {
    await expect(
      loginUser("test@example.com", "wrongpassword"),
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws Invalid credentials for unknown email", async () => {
    await expect(
      loginUser("nobody@example.com", "password123"),
    ).rejects.toThrow("Invalid credentials");
  });
});

// refreshToken integration tests
describe("loginUser()", () => {
  let oldRefreshToken: string;

  beforeEach(async () => {
    await registerUser("test@example.com", "password123");
    const result = await loginUser("test@example.com", "password123");
    oldRefreshToken = result.refreshToken;
  });

  it("returns new access and refresh tokens", async () => {
    // ACT
    const result = await refreshToken(oldRefreshToken);

    // ASSERT
    expect(result.newAccessToken).toBeDefined();
    expect(result.newRefreshToken).toBeDefined();
  });

  it("deletes the old refresh token from the DB", async () => {
    // ACT
    await refreshToken(oldRefreshToken);

    const rows = await db
      .select()
      .from(refresh_tokens)
      .where(eq(refresh_tokens.token, oldRefreshToken));

    // ASSERT
    expect(rows).toHaveLength(0);
  });

  it("saves the new refresh token to the DB", async () => {
    // ACT
    const result = await refreshToken(oldRefreshToken);

    const rows = await db
      .select()
      .from(refresh_tokens)
      .where(eq(refresh_tokens.token, result.newRefreshToken));

    // ASSERT
    expect(rows).toHaveLength(1);
  });

  it("throws Invalid refresh token for a token not in the DB", async () => {
    await expect(refreshToken("fake_token")).rejects.toThrow(
      "Invalid refresh token",
    );
  });
});
