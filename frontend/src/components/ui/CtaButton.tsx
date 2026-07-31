import { UploadCloud, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth, useClerk } from '@clerk/react'

export type OptionType = "none" | "resume" | "jd" | "github";

interface ActionButtonsProps {
  activeOption?: OptionType;
  onSelectOption?: (option: OptionType) => void;
}

export function ActionButtons({ activeOption = "resume", onSelectOption }: ActionButtonsProps) {
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  const handleSelect = (option: OptionType) => {
    if (!isSignedIn) {
      openSignIn?.()
      return
    }
    onSelectOption?.(option)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
      <Button
        className={`rounded-full h-11 px-6 text-sm font-semibold gap-2.5 transition-all active:scale-95 cursor-pointer ${
          activeOption === "resume" && isSignedIn
            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
        }`}
        onClick={() => handleSelect("resume")}
      >
        <UploadCloud className={`w-4 h-4 ${activeOption === "resume" && isSignedIn ? "text-white" : "text-emerald-500"}`} />
        <span>Upload Resume</span>
      </Button>

      <Button
        className={`rounded-full h-11 px-6 text-sm font-semibold gap-2.5 transition-all active:scale-95 cursor-pointer ${
          activeOption === "jd" && isSignedIn
            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
        }`}
        onClick={() => handleSelect("jd")}
      >
        <FileText className={`w-4 h-4 ${activeOption === "jd" && isSignedIn ? "text-white" : "text-emerald-500"}`} />
        <span>Job Description (JD)</span>
      </Button>

      <Button
        className={`rounded-full h-11 px-6 text-sm font-semibold gap-2.5 transition-all active:scale-95 cursor-pointer ${
          activeOption === "github" && isSignedIn
            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
        }`}
        onClick={() => handleSelect("github")}
      >
        <svg className={`w-4 h-4 fill-current ${activeOption === "github" && isSignedIn ? "text-white" : "text-emerald-500"}`} viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <span>GitHub Username</span>
      </Button>
    </div>
  )
}

export function ButtonRounded() {
  return <ActionButtons />
}