import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env";

// postgres connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// wrap pool for drizzle queries
export const db = drizzle(pool);
