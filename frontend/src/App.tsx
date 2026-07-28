import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="flex items-center justify-between py-4">
           
            <h1 className="font-bold text-xl text-slate-800 cursor-pointer flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                AI
              </span>
              Interview AI
            </h1>

            <div className="hidden md:flex items-center">
              <ul className="flex items-center space-x-2 text-slate-700 font-medium">
                <li>
                  <a
                    href="#"
                    className="inline-block rounded-md px-3 py-2 hover:text-[#43C96A] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-block rounded-md px-3 py-2 hover:text-[#43C96A] transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-block rounded-md px-3 py-2 hover:text-[#43C96A] transition-colors"
                  >
                    Learn & grow
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-block rounded-md px-3 py-2 hover:text-[#43C96A] transition-colors"
                  >
                    Notes
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/35 border border-emerald-400/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    </div>
  );
}

export default App;
