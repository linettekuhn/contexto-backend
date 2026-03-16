import { vi, beforeEach, describe, it, expect } from "vitest";

// mock imports
vi.mock("../db/connection", () => ({
  // define mock functions
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../utils/password", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock("../utils/jwt", () => ({
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
}));

import {
  registerUser,
  loginUser,
  refreshToken,
} from "../../services/auth.service";
import { db } from "../../db/connection";
import { hashPassword, verifyPassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

// mock functions with correct types
const mockDb = vi.mocked(db);
const mockHashPassword = vi.mocked(hashPassword);
const mockVerifyPassword = vi.mocked(verifyPassword);
const mockGenerateAccessToken = vi.mocked(generateAccessToken);
const mockGenerateRefreshToken = vi.mocked(generateRefreshToken);

// mock user
const fakeUser = {
  id: "10",
  email: "test@example.com",
  password_hash: "hashed_password_xyz",
  created_at: new Date(),
};

// reset all mocks
beforeEach(() => {
  vi.clearAllMocks();
});

// register unit tests
describe("registerUser()", () => {
  it("hashes the password before storing it", async () => {
    // ARRANGE
    mockHashPassword.mockResolvedValue("hashed_password_xyz");
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([fakeUser]),
      }),
    } as any);
    // ACT
    await registerUser("test@example.com", "plaintext_password");
    // ASSERT
    expect(mockHashPassword).toHaveBeenCalledWith("plaintext_password");
    expect(mockHashPassword).not.toHaveBeenCalledWith("hashed_password_xyz");
  });

  it("inserts the hashed password into the DB, not the plain one", async () => {
    // ARRANGE
    mockHashPassword.mockResolvedValue("hashed_password_xyz");
    const valuesMock = vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([fakeUser]),
    });
    mockDb.insert.mockReturnValue({
      values: valuesMock,
    } as any);
    // ACT
    await registerUser("test@example.com", "plaintext_password");
    // ASSERT
    expect(valuesMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password_hash: "hashed_password_xyz",
    });
  });

  it("returns the created user from the DB", async () => {
    // ARRANGE
    mockHashPassword.mockResolvedValue("hashed_password_xyz");
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([fakeUser]),
      }),
    } as any);
    // ACT
    const result = await registerUser("test@example.com", "plaintext_password");
    // ASSERT
    expect(result).toEqual(fakeUser);
  });
});

// login unit tests
describe("loginUser()", () => {
  // helper select db mock
  function mockDbSelectReturnsUser(user = fakeUser) {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([user]),
      }),
    } as any);
  }

  function mockDbInsertSuccess() {
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);
  }

  it('throws "Invalid credentials" when no user found with that email', async () => {
    // ARRANGE
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    // ASSERT
    await expect(loginUser("nobody@example.com", "password")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it('throws "Invalid credentials" when password is wrong', async () => {
    // ARRANGE
    mockDbSelectReturnsUser();
    mockVerifyPassword.mockResolvedValue(false);

    // ASSERT
    await expect(
      loginUser("test@example.com", "wrong_password"),
    ).rejects.toThrow("Invalid credentials");
  });

  it("returns accessToken, refreshToken, and user on success", async () => {
    // ARRANGE
    mockDbSelectReturnsUser();
    mockVerifyPassword.mockResolvedValue(true);
    mockGenerateAccessToken.mockResolvedValue("access_token_abc");
    mockGenerateRefreshToken.mockResolvedValue("refresh_token_xyz");
    mockDbInsertSuccess();

    // ACT
    const result = await loginUser("test@example.com", "correct_password");

    // ASSERT
    expect(result).toEqual({
      accessToken: "access_token_abc",
      refreshToken: "refresh_token_xyz",
      user: fakeUser,
    });
  });
});

// refreshTokens unit tests
describe("refreshToken", () => {
  // mock token record
  const fakeTokenRecord = {
    id: "token-record-456",
    user_id: fakeUser.id,
    token: "old_refresh_token",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  // helper select db mock
  function mockDbSelectReturnsToken(record = fakeTokenRecord) {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([record]),
      }),
    } as any);
  }

  function mockDbDeleteSuccess() {
    mockDb.delete.mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any);
  }

  function mockDbInsertSuccess() {
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);
  }

  it('throws "Invalid refresh token" when token not found in DB', async () => {
    // ARRANGE
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    // ASSERT
    await expect(refreshToken("nonexistent_token")).rejects.toThrow(
      "Invalid refresh token",
    );
  });

  it("deletes the old refresh token", async () => {
    // ARRANGE
    mockDbSelectReturnsToken();
    mockGenerateAccessToken.mockReturnValue("new_access_token");
    mockGenerateRefreshToken.mockReturnValue("new_refresh_token");
    mockDbDeleteSuccess();
    mockDbInsertSuccess();

    // ACT
    await refreshToken("old_refresh_token");

    // ASSERT
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it("returns new access and refresh tokens", async () => {
    // ARRANGE
    mockDbSelectReturnsToken();
    mockGenerateAccessToken.mockReturnValue("new_access_token");
    mockGenerateRefreshToken.mockReturnValue("new_refresh_token");
    mockDbDeleteSuccess();
    mockDbInsertSuccess();

    // ACT
    const result = await refreshToken("old_refresh_token");

    // ASSERT
    expect(result).toEqual({
      newAccessToken: "new_access_token",
      newRefreshToken: "new_refresh_token",
    });
  });
});
