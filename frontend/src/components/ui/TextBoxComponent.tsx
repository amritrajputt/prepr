import { FileText, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { uploadJD } from "@/services/userdata";

export function TextBoxComponent() {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const result = await uploadJD(text, token);
      toast.success("Job description submitted successfully!", {
        position: "bottom-right",
        duration: 4000,
      });
      console.log("JD upload result:", result);
      navigate({ to: "/interview/$interviewId", params: { interviewId: "jd" } as any });
    } catch (error: unknown) {
      console.error("JD upload error:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : "Failed to upload job description. Please try again.";
      toast.error(errorMessage, {
        position: "bottom-right",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-border bg-card shadow-sm p-4 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500"
      >
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
          <FileText className="w-4 h-4 text-emerald-500" />
          <span>Job Description (JD)</span>
        </div>

        <textarea
          rows={6}
          value={text}
          onChange={handleTextChange}
          placeholder="Paste full job description here (role requirements, responsibilities, skills)..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none resize-y min-h-[140px] leading-relaxed"
        />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <span>{text.length} characters</span>

          <Button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium gap-1.5 h-9 px-4 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start AI Interview</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TextBoxComponent;