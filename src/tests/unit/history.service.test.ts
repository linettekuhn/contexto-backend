import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../db/connection", () => ({
  db: {
    select: vi.fn(),
    delete: vi.fn(),
  },
}));

import {
  getUserHistory,
  deleteHistoryEntry,
} from "../../services/history.service";
import { db } from "../../db/connection";

const mockDb = vi.mocked(db);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUserHistory()", () => {
  it("queries translations for the correct user", async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              offset: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      }),
    } as any);

    await getUserHistory(1);

    expect(mockDb.select).toHaveBeenCalled();
  });

  it("uses default limit of 20 and offset of 0", async () => {
    const mockOffset = vi.fn().mockResolvedValue([]);
    const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({ limit: mockLimit }),
        }),
      }),
    } as any);

    await getUserHistory(1);

    expect(mockLimit).toHaveBeenCalledWith(20);
    expect(mockOffset).toHaveBeenCalledWith(0);
  });

  it("uses provided limit and offset", async () => {
    const mockOffset = vi.fn().mockResolvedValue([]);
    const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({ limit: mockLimit }),
        }),
      }),
    } as any);

    await getUserHistory(1, 10, 40);

    expect(mockLimit).toHaveBeenCalledWith(10);
    expect(mockOffset).toHaveBeenCalledWith(40);
  });
});

describe("deleteHistoryEntry()", () => {
  it("calls delete on the db", async () => {
    mockDb.delete.mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    } as any);

    await deleteHistoryEntry(5, 1);

    expect(mockDb.delete).toHaveBeenCalled();
  });
});
