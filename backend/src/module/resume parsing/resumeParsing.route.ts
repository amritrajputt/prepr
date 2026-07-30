import multer from "multer"
import express, { Router } from "express"
import { ResumeParsingController } from "./resumeParsing.controller.js"
const resumeRouter: Router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed"))
    }
  },
})

const handleUpload = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload.single("resume")(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ statusCode: 400, success: false, message: err.message || "File upload error" })
    }
    next()
  })
}

resumeRouter.post("/uploadResume", handleUpload, ResumeParsingController.parseResume)

export default resumeRouter