import { db } from "../../index.js";
import { eq } from "drizzle-orm";
import {
  resumesTable,
  githubMetadataTable,
  jobDescriptionMetadataTable,
} from "../../DB/schema.js";

/**
 * Cleans up temporary resume, GitHub metadata, and Job Description metadata
 * for a user once their interview ends.
 */
export async function cleanupUserInterviewMetadata(userId: string) {
  try {
    await Promise.all([
      db.delete(resumesTable).where(eq(resumesTable.userId, userId)),
      db.delete(githubMetadataTable).where(eq(githubMetadataTable.userId, userId)),
      db.delete(jobDescriptionMetadataTable).where(eq(jobDescriptionMetadataTable.userId, userId)),
    ]);
    console.log(`Successfully cleaned up interview metadata for user: ${userId}`);
  } catch (error) {
    console.error(`Failed to cleanup metadata for user ${userId}:`, error);
    throw error;
  }
}
