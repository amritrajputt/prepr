import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useUser, useAuth, UserButton } from "@clerk/react";
import { Bot, Mic, User as UserIcon, X } from "lucide-react";
import api from "../services/api";
import { DeepgramClient } from "@deepgram/sdk";

type InterviewProps = {
  interviewId?: string;
};

export function Interview({ interviewId: propInterviewId }: InterviewProps) {
  const routeParams = useParams({ strict: false }) as Record<string, string | undefined>;
  const interviewId = propInterviewId ?? routeParams.interviewId;
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstruction(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
     let cancelled = false;


    (async () => {
      const pc: RTCPeerConnection | null = new RTCPeerConnection();

      pc.ontrack = (e) => {
        if (audioElement.current) {
          audioElement.current.srcObject = e.streams[0];
          audioElement.current.play().catch((err) => {
            console.warn("Autoplay prevented or failed, user interaction may be required:", err);
          });
        }
      };



      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });

      const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
        'token', 'c5defb157973a42e76e133847ee4aaaaed9c1669'
      ]);

      socket.onopen = () => {
        const mediaRecorder = new MediaRecorder(ms, { mimeType: 'audio/webm' });

        mediaRecorder.start(250);
        mediaRecorder.addEventListener('dataavailable', (event) => {
          socket.send(event.data);
          console.log(event.data)
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const transcript = data.channel.alternatives[0].transcript;
        if (transcript) {
          console.log(transcript);
        }
      };

      if (!pc) return;
      pc.addTrack(ms.getTracks()[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const token = await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/sdp",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const sdpResponse = await api.post(`/api/session/${interviewId || "general"}`, offer.sdp, {
        headers,
        responseType: "text",
      });

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: sdpResponse.data,
      };
      await pc.setRemoteDescription(answer);
    } catch (err) {
      console.error("WebRTC session error:", err);
    }
  })();

  return () => {
        cancelled = true
      cleanup();
    
  }



}, []);

const handleCancel = () => {
  navigate({ to: "/" });
};

return (
  <div className="flex flex-col items-center justify-between min-h-screen p-6 bg-gradient-to-b from-background via-background/95 to-muted/40 text-foreground">
    <audio ref={audioElement} autoPlay playsInline className="hidden" />

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
      {/* Say Go Ahead Instruction Card (Hides after 10 seconds) */}
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
          <p className="text-xs text-muted-foreground mt-1">
            {user?.primaryEmailAddress?.emailAddress || "Interview Candidate"}
          </p>
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






