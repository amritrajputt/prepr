import type { Request, Response } from "express";
import { SessionService } from "./session.service.js";

export class SessionController {
  static async createSession(req: Request, res: Response) {
    try {
      const sdpText = req.body;
      if (!sdpText || typeof sdpText !== "string") {
        return res.status(400).json({ error: "Invalid or missing SDP payload" });
      }

      const sdp = await SessionService.createRealtimeSession(sdpText);
      res.setHeader("Content-Type", "application/sdp");
      return res.status(200).send(sdp);
    } catch (error: any) {
      console.error("Token generation error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate token" });
    }
  }
}
