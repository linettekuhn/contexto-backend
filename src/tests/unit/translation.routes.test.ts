import { describe, it, expect, vi, beforeEach } from "vitest";
import { optionalAuth } from "../../routes/translate.routes";
import { AuthRequest } from "../../middleware/authMiddleware";
import { Response, NextFunction } from "express";

// mock authMiddleware so we can check if it was called
vi.mock("../../middleware/authMiddleware", () => ({
  authMiddleware: vi.fn(),
}));

import { authMiddleware } from "../../middleware/authMiddleware";
const mockAuthMiddleware = vi.mocked(authMiddleware);

const mockRes = {} as Response;
const mockNext = vi.fn() as NextFunction;

beforeEach(() => vi.clearAllMocks());

describe("optionalAuth()", () => {
  it("calls next() directly when no Authorization header is present", () => {
    const req = { headers: {} } as AuthRequest;

    optionalAuth(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockAuthMiddleware).not.toHaveBeenCalled();
  });

  it("calls authMiddleware when Authorization header is present", () => {
    const req = {
      headers: { authorization: "Bearer sometoken" },
    } as AuthRequest;

    optionalAuth(req, mockRes, mockNext);

    expect(mockAuthMiddleware).toHaveBeenCalledWith(req, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
