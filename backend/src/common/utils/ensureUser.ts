import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/express";
import { db } from "../../index.js";
import { usersTable } from "../../DB/schema.js";

export async function ensureUserExists(userId: string): Promise<void> {
  if (!userId) return;

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    const clerkUser = await clerkClient.users.getUser(userId);
    const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
    const name = fullName || clerkUser.username || "User";
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error(`User ${userId} does not have a primary email registered in Clerk.`);
    }

    await db
      .insert(usersTable)
      .values({
        id: userId,
        name,
        email,
      })
      .onConflictDoNothing();
  }
}
