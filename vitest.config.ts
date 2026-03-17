import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/services/**", "src/controllers/**"],
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/tests/unit/**/*.test.ts"],
          setupFiles: [], // no DB migration
        },
      },
      {
        test: {
          name: "integration",
          include: ["src/tests/integration/**/*.test.ts"],
          setupFiles: ["./src/tests/setup.ts"], // runs migrations
        },
      },
    ],
  },
});
