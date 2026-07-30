import { getAuth } from "@clerk/express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { ResumeParsingService } from "./resumeParsing.service.js";


export class ResumeParsingController {

    static async parseResume(req: any, res: any) {

        const userId = getAuth(req).userId
        if (!userId) {
            return res.status(401).json(ApiError.unauthorized("Unauthorized"))
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json(ApiError.badRequest("No file uploaded"));
        }
        const { originalname, mimetype, buffer } = file
        console.log(mimetype)
        console.log(buffer)
        console.log(originalname)
        if (mimetype !== "application/pdf") {
            return res.status(400).json(ApiError.badRequest("Only PDF files are allowed"))
        }
        try {
            const rawText = await ResumeParsingService.extractTextFromBuffer(buffer)

            if (!rawText || rawText.trim().length === 0) {
                return res
                    .status(422)
                    .json(ApiError.badRequest("Could not extract text from PDF"))
            }
            const resume = await ResumeParsingService.saveResumeText({
                userId,
                rawText,
                fileName: originalname,
            })

            return res
                .status(200)
                .json(ApiResponse.success({ userId, fileName: originalname }))
        } catch (err: any) {
            console.error("Resume parsing error:", err)
            return res.status(500).json(ApiError.internal(err.message))
        }
    }
}