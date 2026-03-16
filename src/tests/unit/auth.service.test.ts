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
        returning: vi.fn().mockResolvedValue([fakeUser]);
    });
    mockDb.insert.mockReturnValue({
      values: valuesMock,
    } as any);

    // ACT
    await registerUser("test@example.com", "plaintext_password");

    // ASSERT
    expect(valuesMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password_hash: 'hashed_password_xyz',
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
    const result=await registerUser("test@example.com", "plaintext_password");

    // ASSERT
    expect(result).toEqual(fakeUser);
  });
});


