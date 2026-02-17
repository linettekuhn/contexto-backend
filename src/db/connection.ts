import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";

dotenv.config();

// postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// wrap pool for drizzle queries
export const db = drizzle(pool);
