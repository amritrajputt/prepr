import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useUser, UserButton } from "@clerk/react";
import { Bot, User as UserIcon, X } from "lucide-react";

type InterviewProps = {
  interviewId?: string;
};

export function Interview({ interviewId: propInterviewId }: InterviewProps) {
  const routeParams = useParams({ strict: false }) as Record<string, string | undefined>;
  const interviewId = propInterviewId ?? routeParams.interviewId;
  const { user } = useUser();
  const navigate = useNavigate();
  const audioElement = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let pc: RTCPeerConnection | null = new RTCPeerConnection();

    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => {
      if (audioElement.current) {
        audioElement.current.srcObject = e.streams[0];
      }
    };

    (async () => {
      try {
        const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!pc) return;
        pc.addTrack(ms.getTracks()[0]);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpResponse = await fetch("/session", {
          method: "POST",
          body: offer.sdp,
          headers: {
            "Content-Type": "application/sdp",
          },
        });

        const answer: RTCSessionDescriptionInit = {
          type: "answer",
          sdp: await sdpResponse.text(),
        };
        await pc.setRemoteDescription(answer);
      } catch (err) {
        console.error("WebRTC session error:", err);
      }
    })();

    return () => {
      if (pc) {
        pc.close();
        pc = null;
      }
    };
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






