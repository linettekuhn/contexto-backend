import { beforeEach, describe, expect, it, vi } from "vitest";

// mock api
vi.mock("../../utils/openaiClient", () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

import { openai } from "../../utils/openaiClient";
import { translateText } from "../../services/translation.service";
import { db } from "../../db/connection";
import { translations } from "../../db/schema";

// mock functions with correct types
const mockOpenAI = vi.mocked(openai.chat.completions.create);
function mockOpenAIReturns(text: string) {
  mockOpenAI.mockResolvedValue({
    choices: [{ message: { content: text } }],
  } as any);
}

// mock data
const baseRequest = {
  original_text: "Hello, how are you?",
  source_language: "English",
  target_language: "Spanish",
  dialect: "Mexican",
  formality: 0.5,
};

// reset all mocks
beforeEach(async () => {
  vi.clearAllMocks();
  await db.delete(translations);
});

// translateText integration tests
describe("translateText()", () => {
  it("inserts the translation into the DB and returns it", async () => {
    mockOpenAIReturns("¿Qué onda, cómo estás?");

    const result = await translateText(baseRequest);

    expect(result.translation).toBe("¿Qué onda, cómo estás?");
    expect(result.db_record.id).toBeDefined();
    expect(result.db_record.translated_text).toBe("¿Qué onda, cómo estás?");
  });

  it("persists the correct fields to the DB", async () => {
    mockOpenAIReturns("¿Qué onda, cómo estás?");

    const result = await translateText(baseRequest);

    const [row] = await db.select().from(translations);

    expect(row.original_text).toBe(baseRequest.original_text);
    expect(row.source_language).toBe(baseRequest.source_language);
    expect(row.target_language).toBe(baseRequest.target_language);
    expect(row.dialect).toBe(baseRequest.dialect);
    expect(row.translated_text).toBe("¿Qué onda, cómo estás?");
  });

  it("throws when OpenAI returns empty content", async () => {
    mockOpenAI.mockResolvedValue({
      choices: [{ message: { content: null } }],
    } as any);

    await expect(translateText(baseRequest)).rejects.toThrow(
      "Translation failed",
    );
  });

  it("does not insert anything into the DB when OpenAI fails", async () => {
    mockOpenAI.mockRejectedValue(new Error("OpenAI error"));

    await expect(translateText(baseRequest)).rejects.toThrow();

    const rows = await db.select().from(translations);
    expect(rows).toHaveLength(0);
  });
});
