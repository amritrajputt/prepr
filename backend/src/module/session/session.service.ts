export class SessionService {
  static async createRealtimeSession(sdpText: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured in environment variables (.env)");
    }

    const sessionConfig = JSON.stringify({
      type: "realtime",
      model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
      audio: { output: { voice: process.env.OPENAI_REALTIME_VOICE || "cedar" } },
    });

    const fd = new FormData();
    fd.set("sdp", sdpText);
    fd.set("session", sessionConfig);

    let r = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });

    if (!r.ok && (r.status === 404 || r.status === 400)) {
      const model = process.env.OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview-2024-12-17";
      console.warn(`Primary Realtime calls endpoint returned ${r.status}. Trying OpenAI WebRTC fallback with model ${model}...`);
      r = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/sdp",
        },
        body: sdpText,
      });
    }

    if (!r.ok) {
      const errorText = await r.text();
      throw new Error(`OpenAI Realtime API error (${r.status}): ${errorText}`);
    }

    const sdp = await r.text();
    return sdp;
  }
}


