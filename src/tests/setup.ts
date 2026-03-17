import { beforeAll, afterAll } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db/connection";
import path from "path";

beforeAll(async () => {
  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, "../../drizzle/migrations"),
  });
});

afterAll(async () => {
  await db.$client.end();
});
