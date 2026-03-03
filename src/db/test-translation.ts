import { db } from "./connection";
import { translations } from "./schema";

export default async function testInsert() {
  const result = await db
    .insert(translations)
    .values({
      original_text: "Hello",
      translated_text: "Hola",
      source_language: "en",
      target_language: "es",
      dialect: "mexican",
    })
    .returning();
  console.log("Inserted translation:", result);
}
