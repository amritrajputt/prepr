import * as React from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export function InputField({
  label = "GitHub Username",
  description = "Enter your GitHub username to analyze your repositories and generate tailored interview questions.",
  placeholder = "username",
  ...props
}: InputFieldProps) {
  const [username, setUsername] = React.useState("")

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm p-5 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        <label htmlFor="github-username-input" className="flex items-center gap-2 mb-1 text-sm font-semibold text-foreground">
          <svg className="w-4 h-4 fill-current text-emerald-500" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>{label}</span>
        </label>

        <p className="text-xs text-muted-foreground mb-4">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium select-none">
              github.com/
            </span>
            <input
              id="github-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-28 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-background transition-all"
              {...props}
            />
          </div>

          <Button
            disabled={!username.trim()}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium gap-1.5 h-10 px-5 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze & Start</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Input }
export default InputField
