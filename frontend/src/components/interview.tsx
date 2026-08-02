import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useUser, useAuth, UserButton } from "@clerk/react";
import { Bot, Mic, User as UserIcon, X } from "lucide-react";

import api from "../services/api";

type Status = "connecting" | "live" | "ending";
function createLevelMeter(ctx: AudioContext, stream: MediaStream) {
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);

    return () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            const v = (data[i]! - 128) / 128;
            sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        // Boost and clamp so normal speech fills most of the range.
        return Math.min(1, rms * 3.2);
    };
}

interface InterviewProps {
  interviewId?: string;
}

export function Interview({ interviewId: propInterviewId }: InterviewProps = {}) {

  const params = useParams({ strict: false });
  const interviewId = propInterviewId || (params as Record<string, string>)?.interviewId;
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("connecting");
  const [userLevel, setUserLevel] = useState<number>(0);
  const [aiLevel, setAiLevel] = useState<number>(0);
  const [showInstruction, setShowInstruction] = useState<boolean>(true);

  // reference to clean when component unmounts
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstruction(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const pc: RTCPeerConnection | null = new RTCPeerConnection();
      pcRef.current = pc;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      let aiMeter: (() => number) | null = null;
      let userMeter: (() => number) | null = null;

      pc.ontrack = (e) => {
        const stream = e.streams[0];
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
        }
        aiMeter = createLevelMeter(audioContext, stream);
      };

      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (cancelled) {
        ms.getTracks().forEach((track) => track.stop());
        return;
      }
      userStreamRef.current = ms;
      userMeter = createLevelMeter(audioContext, ms);

      if (!pc) return;

      pc.addTrack(ms.getTracks()[0]!);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const token = await getToken();
      const sdpResponse = await api.post(`/api/session/${interviewId}`, offer.sdp, {
        headers: {
          "Content-Type": "application/sdp",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: sdpResponse.data
      };
      await pc.setRemoteDescription(answer);

      if (cancelled) return;
      setStatus("live");

      const tick = () => {
        if (aiMeter) setAiLevel(aiMeter());
        if (userMeter) setUserLevel(userMeter());
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      cleanup();
    };

  }, [interviewId]);

  function cleanup() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    userStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    audioContextRef.current?.close().catch(() => { });
  }

  function endInterview() {
    setStatus("ending");
    cleanup();
    navigate({ to: "/" });
  }
  const handleCancel = () => {
    navigate({ to: "/" });
  };
  const aiSpeaking = aiLevel > 0.06 && aiLevel >= userLevel;
    const userSpeaking = userLevel > 0.06 && userLevel > aiLevel;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 bg-gradient-to-b from-background via-background/95 to-muted/40 text-foreground">
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Mock Interview Session</h1>
            {interviewId && (
              <p className="text-xs text-muted-foreground font-mono">ID: {interviewId}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserButton />
        </div>
      </header>

      <main className="w-full max-w-5xl my-auto py-8">
        {showInstruction && (
          <div className="w-full max-w-xl mx-auto mb-8 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-center backdrop-blur-md shadow-lg transition-all duration-500">
            <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-2">
              <Mic className="w-4 h-4 animate-bounce text-emerald-400" />
              Say <span className="underline font-bold text-emerald-300 font-mono text-base px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">"Go ahead"</span> to start your interview
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Speak into your microphone whenever you are ready to begin the session.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md shadow-xl text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75 blur-md animate-pulse" />
              <img
                src="/robot.png"
                alt="AI Robot Interviewer"
                className="relative w-44 h-44 object-cover rounded-full border-4 border-background shadow-2xl"
              />
            </div>
            <h2 className="text-lg font-bold tracking-wide flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" /> AI Interviewer
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Realtime Voice Agent</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Session Active — Go Ahead & Speak</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md shadow-xl text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-75 blur-md animate-pulse" />
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User Profile"}
                  className="relative w-44 h-44 object-cover rounded-full border-4 border-background shadow-2xl"
                />
              ) : (
                <div className="relative w-44 h-44 rounded-full border-4 border-background bg-secondary flex items-center justify-center shadow-2xl">
                  <UserIcon className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold tracking-wide">
              {user?.fullName || user?.firstName || "Candidate"}
            </h2>
          </div>
        </div>

    
      </main>

      <footer className="w-full max-w-5xl flex justify-center pb-4">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
          Cancel Session
        </button>
      </footer>
    </div>
  );
}






