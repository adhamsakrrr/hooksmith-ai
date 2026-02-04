import HookGenerator from './components/HookGenerator';

export default function Home() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-24 overflow-hidden selection:bg-purple-500 selection:text-white">
            {/* Background Gradient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="z-10 w-full max-w-4xl flex flex-col items-center text-center mb-12 space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-purple-400 mr-2 animate-pulse"></span>
                    Powered by Groq Llama 3
                </div>

                <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tight text-white leading-tight">
                    Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">writing</span> hooks.
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light">
                    Let AI get you 20+ viral variations in <span className="text-white font-medium">under 1 second</span>.
                    <br className="hidden md:block" />
                    Because your content deserves to be seen.
                </p>
            </div>

            <div className="w-full relative z-20">
                <HookGenerator />
            </div>

            <footer className="absolute bottom-4 text-center text-gray-600 text-sm">
                Built for creators by HookSmith AI.
            </footer>
        </main>
    );
}
