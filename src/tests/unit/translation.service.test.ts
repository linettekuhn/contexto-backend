import { vi, beforeEach, describe, it, expect } from "vitest";

// mock imports
vi.mock("../utils/openaiClient", () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock("../db/connection", () => ({
  // define mock functions
  db: {
    insert: vi.fn(),
  },
}));

import { translateText } from "../../services/translation.service";
import { openai } from "../../utils/openaiClient";
import { db } from "../../db/connection";

// mock functions with correct types
const mockOpenAI = vi.mocked(openai.chat.completions.create);
const mockDb = vi.mocked(db);

// mock data

const baseRequest = {
  original_text: "Hello, how are you?",
  source_language: "English",
  target_language: "Spanish",
  dialect: "Mexican",
  formality: 0.5,
};

const fakeDbRecord = {
  id: "translation-789",
  original_text: baseRequest.original_text,
  translated_text: "¿Qué onda, cómo estás?",
  source_language: baseRequest.source_language,
  target_language: baseRequest.target_language,
  dialect: baseRequest.dialect,
  created_at: new Date(),
};

// helper mocks
function mockOpenAIReturns(text: string) {
  mockOpenAI.mockResolvedValue({
    choices: [{ message: { content: text } }],
  } as any);
}

function mockDbInsertReturns(record = fakeDbRecord) {
  mockDb.insert.mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([record]),
    }),
  } as any);
}

// reset all mocks
beforeEach(() => {
  vi.clearAllMocks();
});

// translateText unit tests
describe("transalteText()", () => {
  // formality prompt selection tests
  describe("formality prompt selection", () => {
    it("uses formal language prompt when formality <= 0.33", async () => {
      // ARRANGE
      mockOpenAIReturns("Hola");
      mockDbInsertReturns();
      // ACT
      await translateText({ ...baseRequest, formality: 0.1 });
      // ASSERT
      const systemPrompt = mockOpenAI.mock.calls[0][0].messages[0].content;
      expect(systemPrompt).toContain("formal grammar");
    });

    it("uses natural speech prompt when formality is between 0.33 and 0.66", async () => {
      // ARRANGE
      mockOpenAIReturns("Hola");
      mockDbInsertReturns();
      // ACT
      await translateText({ ...baseRequest, formality: 0.5 });
      // ASSERT
      const systemPrompt = mockOpenAI.mock.calls[0][0].messages[0].content;
      expect(systemPrompt).toContain("natural everyday speech");
    });

    it("uses slang prompt when formality > 0.66", async () => {
      // ARRANGE
      mockOpenAIReturns("Hola");
      mockDbInsertReturns();
      // ACT
      await translateText({ ...baseRequest, formality: 0.9 });
      // ASSERT
      const systemPrompt = mockOpenAI.mock.calls[0][0].messages[0].content;
      expect(systemPrompt).toContain("slang");
    });

    it("uses formal prompt at the exact boundary of 0.33", async () => {
      // ARRANGE
      mockOpenAIReturns("Hola");
      mockDbInsertReturns();
      // ACT
      await translateText({ ...baseRequest, formality: 0.33 });
      // ASSERT
      const systemPrompt = mockOpenAI.mock.calls[0][0].messages[0].content;
      expect(systemPrompt).toContain("formal grammar");
    });

    it("uses natural speech at the exact boundary of 0.66", async () => {
      // ARRANGE
      mockOpenAIReturns("Hola");
      mockDbInsertReturns();
      // ACT
      await translateText({ ...baseRequest, formality: 0.66 });
      // ASSERT
      const systemPrompt = mockOpenAI.mock.calls[0][0].messages[0].content;
      expect(systemPrompt).toContain("natural everyday speech");
    });
  });
});
