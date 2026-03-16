import { beforeAll, afterAll } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db/connection";

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
});

afterAll(async () => {
  await db.$client.end();
});
