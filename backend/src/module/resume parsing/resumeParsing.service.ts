// module/resume/resume.service.ts
import { PDFParse } from "pdf-parse"
import { db } from "../../index.js"
import { resumesTable } from "../../DB/schema.js"

export class ResumeParsingService {
    static async extractTextFromBuffer(buffer: Buffer): Promise<string> {
        const parser = new PDFParse({ data: buffer })
        const result = await parser.getText()
        return result.text
    }
    static async saveResumeText({ userId, rawText, fileName }: { userId: string, rawText: string, fileName: string}) {
        const [resume] = await db
            .insert(resumesTable)
            .values({ userId, rawText, fileName })
            .returning()
        return resume
    }
}