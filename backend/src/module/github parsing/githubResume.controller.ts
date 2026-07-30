import { getAuth } from "@clerk/express";
import { ApiError } from "../../common/utils/ApiError.js";
import { ApiResponse } from "../../common/utils/ApiResponse.js";
import { GithubScrapeService } from "./githubResume.service.js";

export class GithubResumeController {
    static async scrapeGithubData(req: any, res: any) {
        const userId = getAuth(req).userId
        if (!userId) {
            return res.status(401).json(ApiError.unauthorized("Unauthorized"))
        }
        const { githubUserId } = req.body
        if (!githubUserId) {
            return res.status(400).json(ApiError.badRequest("No githubUserId provided"))
        }
        try {
            const githubRepos = await GithubScrapeService.getGithubData(userId, githubUserId)
            return res.status(200).json(ApiResponse.success({ userId, githubRepos }))
        } catch (err: any) {
            console.error("Github scrape error:", err)
            return res.status(500).json(ApiError.internal(err.message))
        }
    }
}