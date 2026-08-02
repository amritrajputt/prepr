import { useState } from 'react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import { ModeToggle } from '@/components/mode.toggle';
import { ArrowRight, Bot, Lock } from "lucide-react";
import { ActionButtons, type OptionType } from "@/components/ui/CtaButton";
import FileUpload04 from "@/components/file-upload-04";
import TextBoxComponent from '@/components/ui/TextBoxComponent';
import InputField from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const [activeOption, setActiveOption] = useState<OptionType>("resume");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="flex items-center justify-between py-4">

            <h1 className="font-bold text-xl text-foreground cursor-pointer flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                AI
              </span>
              PREPR AI
            </h1>


            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              <ModeToggle />
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="group relative inline-flex items-center justify-center px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-foreground hover:text-emerald-500 bg-secondary hover:bg-secondary/80 border border-border rounded-xl transition-all duration-200 active:scale-95 cursor-pointer">
                    <svg className="w-4 h-4 mr-1 sm:mr-1.5 text-muted-foreground group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="group relative inline-flex items-center justify-center px-3 py-2 sm:px-5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/35 border border-emerald-400/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    <svg className="w-4 h-4 mr-1 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex flex-col justify-center items-center py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 leading-[1.3] max-w-6xl mx-auto">
            <span className="inline-flex items-center justify-center flex-wrap md:flex-nowrap gap-x-3 gap-y-2">
              <span>Ace Your</span>
              <span className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 sm:px-6 py-1 sm:py-1.5 align-middle shadow-sm transition-transform hover:scale-105 cursor-pointer">
                <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
              </span>
              <span>Next Interview</span>
            </span>
            <br className="hidden md:block" />{" "}
            <span className="inline-flex items-center justify-center flex-wrap md:flex-nowrap gap-x-3 gap-y-2 mt-2 md:mt-1">
              <span>with</span>
              <span className="text-emerald-500 font-extrabold">AI-Powered</span>
              <span className="inline-flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full px-3.5 sm:px-4 py-1 align-middle shadow-inner">
                <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-zinc-700 dark:text-zinc-200" />
              </span>
              <span>Practice</span>
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto font-normal leading-relaxed">
            Practice realistic interviews with AI, get instant feedback on your answers and boost your chances of landing your dream job
          </p>
          <h3 className="mt-8 text-sm sm:text-base md:text-lg font-semibold text-emerald-500 dark:text-emerald-400 text-center max-w-2xl mx-auto tracking-wide">
            Start your interview using any one of the options below:
          </h3>
          <ActionButtons activeOption={activeOption} onSelectOption={setActiveOption} />

          <Show when="signed-out">
            <div className="w-full max-w-md mx-auto mt-8 p-6 rounded-2xl border border-border bg-card shadow-sm text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-foreground text-base mb-1">Authentication Required</h4>
              <p className="text-xs text-muted-foreground mb-4">Please sign in to start your AI-powered mock interview practice.</p>
              <SignInButton mode="modal">
                <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 cursor-pointer">
                  Sign In to Start
                </Button>
              </SignInButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="transition-all duration-300 flex justify-center items-center w-full">
              {activeOption === "resume" && <FileUpload04 />}
              {activeOption === "jd" && <TextBoxComponent />}
              {activeOption === "github" && <InputField />}
            </div>
          </Show>
        </div>
      </main>
    </div>
  );
}
