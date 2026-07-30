import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TextBoxComponent() {
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="relative rounded-2xl border border-border bg-card shadow-sm p-4 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
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
            disabled={!text.trim()}
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium gap-1.5 h-9 px-4 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Start AI Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TextBoxComponent;