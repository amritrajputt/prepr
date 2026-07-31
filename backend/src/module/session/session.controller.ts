import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { eq, desc } from "drizzle-orm";
import { db } from "../../index.js";
import { resumesTable, jobDescriptionMetadataTable, githubMetadataTable } from "../../DB/schema.js";
import { SessionService } from "./session.service.js";
import { initSideBand } from "../sideband/sideband.js";

async function getCandidateContext(userId: string, interviewId: string): Promise<{ type: string; context: string }> {
  const type = (interviewId || "").toLowerCase();
  let context = "";

  if (userId) {
    if (type.includes("resume")) {
      const [resumeRow] = await db.select().from(resumesTable).where(eq(resumesTable.userId, userId)).orderBy(desc(resumesTable.createdAt)).limit(1);
      if (resumeRow) {
        context = `RESUME DETAILS:\nFile Name: ${resumeRow.fileName || "resume.pdf"}\nRaw Resume Text:\n${resumeRow.rawText}`;
      }
    } else if (type.includes("jd") || type.includes("job")) {
      const [jdRow] = await db.select().from(jobDescriptionMetadataTable).where(eq(jobDescriptionMetadataTable.userId, userId)).orderBy(desc(jobDescriptionMetadataTable.createdAt)).limit(1);
      if (jdRow) {
        context = `JOB DESCRIPTION:\n${jdRow.data}`;
      }
    } else if (type.includes("github")) {
      const [ghRow] = await db.select().from(githubMetadataTable).where(eq(githubMetadataTable.userId, userId)).orderBy(desc(githubMetadataTable.createdAt)).limit(1);
      if (ghRow) {
        context = `GITHUB REPOSITORIES:\n${ghRow.data}`;
      }
    }
  }

  // Fallback: If specific context is empty or no type match, gather all available data for the user
  if (!context && userId) {
    const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.userId, userId)).orderBy(desc(resumesTable.createdAt)).limit(1);
    const [jd] = await db.select().from(jobDescriptionMetadataTable).where(eq(jobDescriptionMetadataTable.userId, userId)).orderBy(desc(jobDescriptionMetadataTable.createdAt)).limit(1);
    const [github] = await db.select().from(githubMetadataTable).where(eq(githubMetadataTable.userId, userId)).orderBy(desc(githubMetadataTable.createdAt)).limit(1);

    const parts: string[] = [];
    if (resume) parts.push(`RESUME DETAILS:\n${resume.rawText}`);
    if (jd) parts.push(`JOB DESCRIPTION:\n${jd.data}`);
    if (github) parts.push(`GITHUB REPOSITORIES:\n${github.data}`);
    context = parts.join("\n\n---\n\n");
  }

  // Final fallback if context is still empty (e.g. dev mode without auth header)
  if (!context) {
    const [latestResume] = await db.select().from(resumesTable).orderBy(desc(resumesTable.createdAt)).limit(1);
    const [latestJd] = await db.select().from(jobDescriptionMetadataTable).orderBy(desc(jobDescriptionMetadataTable.createdAt)).limit(1);
    const [latestGithub] = await db.select().from(githubMetadataTable).orderBy(desc(githubMetadataTable.createdAt)).limit(1);

    const parts: string[] = [];
    if (latestResume) parts.push(`RESUME DETAILS:\n${latestResume.rawText}`);
    if (latestJd) parts.push(`JOB DESCRIPTION:\n${latestJd.data}`);
    if (latestGithub) parts.push(`GITHUB REPOSITORIES:\n${latestGithub.data}`);
    context = parts.join("\n\n---\n\n");
  }

  if (!context) {
    context = "No specific Resume, JD, or GitHub context provided yet.";
  }

  return { type, context };
}

export class SessionController {
  static async createSession(req: Request, res: Response) {
    try {
      const sdpText = req.body;
      if (!sdpText || typeof sdpText !== "string") {
        return res.status(400).json({ error: "Invalid or missing SDP payload" });
      }

      const auth = getAuth(req);
      const userId = auth?.userId || "";
      const interviewId = (req.params.interviewId as string) || "general";

      const { type, context } = await getCandidateContext(userId, interviewId);
      const { sdp, callId } = await SessionService.createRealtimeSession(sdpText);

      res.setHeader("Content-Type", "application/sdp");
      res.status(200).send(sdp);

      if (callId) {
        initSideBand(callId, type, context);
      }

    } catch (error: any) {
      console.error("Token generation error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate token" });
    }
  }
}
