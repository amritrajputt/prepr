import express, { Router } from "express"
import { GithubResumeController } from "./githubResume.controller.js"

const githubRouter: Router = Router()

githubRouter.post("/githubdata", GithubResumeController.scrapeGithubData)

export default githubRouter