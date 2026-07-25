import { db } from "../../index.js";
import { usersTable } from "../../DB/schema.js";
import { eq } from "drizzle-orm";

export class AuthService {
    static async createUser(userData: any) {
        return await db.insert(usersTable).values({
            id: userData.id,
            name: `${userData.first_name ?? ""} ${userData.last_name ?? ""}`.trim(),
            email: userData.email_addresses[0]?.email_address,
        });
    }

    static async updateUser(userData: any) {
        return await db
            .update(usersTable)
            .set({
                name: `${userData.first_name ?? ""} ${userData.last_name ?? ""}`.trim(),
                email: userData.email_addresses[0]?.email_address,
                updated_at: new Date(),
            })
            .where(eq(usersTable.id, userData.id));
    }

    static async deleteUser(userData: any) {
        return await db
            .delete(usersTable)
            .where(eq(usersTable.id, userData.id));
    }
}