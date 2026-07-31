import { eq } from "drizzle-orm";
import { db } from "../../index.js";
import { jobDescriptionMetadataTable } from "../../DB/schema.js";
import { ensureUserExists } from "../../common/utils/ensureUser.js";

export class JDService {
  static async saveJd(userId: string, jdText: string) {
    await ensureUserExists(userId);

    const existing = await db
      .select()
      .from(jobDescriptionMetadataTable)
      .where(eq(jobDescriptionMetadataTable.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const [updatedRow] = await db
        .update(jobDescriptionMetadataTable)
        .set({
          data: jdText,
          createdAt: new Date(),
        })
        .where(eq(jobDescriptionMetadataTable.userId, userId))
        .returning();
      return updatedRow;
    }

    const [insertedRow] = await db
      .insert(jobDescriptionMetadataTable)
      .values({
        userId: userId,
        data: jdText,
      })
      .returning();

    return insertedRow;
  }
}