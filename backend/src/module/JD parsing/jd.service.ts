import { db } from "../../index.js"
import { jobDescriptionMetadataTable } from "../../DB/schema.js"
export class JDService {
    static async saveJd(userId: string, jdText: string) {

        const [insertedRow] = await db.insert(jobDescriptionMetadataTable).values({
            userId: userId,
            data: jdText,
        }).returning();
        return insertedRow;
    }
}