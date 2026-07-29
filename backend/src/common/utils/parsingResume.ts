// resume.controller.ts
import { extractTextFromBuffer } from './resume.service.js'
import { saveResumeText } from './resume.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { getAuth } from '@clerk/express'

export const parseResume = async (req: any, res: any) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json(ApiError.badRequest("Unauthorized"))
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json(ApiError.badRequest("No file uploaded"))
  }

  const { originalname, mimetype, buffer } = file

  if (mimetype !== "application/pdf") {
    return res.status(400).json(ApiError.badRequest("Invalid file type — only PDF allowed"))
  }

  try {
    // Step 1: extract text from buffer
    const rawText = await extractTextFromBuffer(buffer, mimetype)

    // Step 2: store in DB
    const resume = await saveResumeText({
      userId,
      fileName: originalname,
      rawText,
    })

    return res.status(200).json(
      ApiResponse.success({ resumeId: resume.id, fileName: originalname })
    )
  } catch (err: any) {
    console.error(err)
    return res.status(500).json(ApiError.internal(err.message))
  }
}