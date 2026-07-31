import axios from "axios";

export class SessionService {
  static async createRealtimeSession(sdpText: string): Promise<{ sdp: string; callId: string }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured in environment variables (.env)");
    }

    const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1-mini";

    const sessionConfig = JSON.stringify({
      type: "realtime",
      model,
      audio: { output: { voice: process.env.OPENAI_REALTIME_VOICE || "verse" } },
    });

    const fd = new FormData();
    fd.set("sdp", sdpText);
    fd.set("session", sessionConfig);

    let response = await axios.post("https://api.openai.com/v1/realtime/calls", fd, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      responseType: "text",
      validateStatus: () => true,
    });

    if (response.status !== 200 && (response.status === 404 || response.status === 400)) {
      console.warn(`Primary Realtime calls endpoint returned ${response.status}. Trying OpenAI WebRTC fallback with model ${model}...`);
      response = await axios.post(`https://api.openai.com/v1/realtime?model=${model}`, sdpText, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/sdp",
        },
        responseType: "text",
        validateStatus: () => true,
      });
    }

    const locationHeader = response.headers["location"] || response.headers["Location"];
    const location = typeof locationHeader === "string" ? locationHeader : undefined;
    const callId = location?.split("/").pop() || "";
    console.log("Realtime Call ID:", callId);

    if (response.status < 200 || response.status >= 300) {
      const errorText = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      throw new Error(`OpenAI Realtime API error (${response.status}): ${errorText}`);
    }

    return { sdp: response.data, callId };
  }
}


