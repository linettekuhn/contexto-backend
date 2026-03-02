import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected! Server time:", res.rows[0]);
  } catch (err) {
    console.error("Connection error:", err);
  }
}
