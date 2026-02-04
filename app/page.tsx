import { Sparkles } from "lucide-react";
import HookGenerator from './components/HookGenerator';

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center px-4 pt-16 pb-12">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/60 border border-gray-800 backdrop-blur-sm mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300">Powered by Groq Llama 3</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl mb-4 font-display">
                        Stop{" "}
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            writing
                        </span>{" "}
                        hooks.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-gray-400 max-w-2xl font-sans">
                        Generate viral social media hooks in seconds. AI-powered, platform-optimized, ridiculously fast.
                    </p>
                </div>

                {/* Main Interface */}
                <div className="flex-1 flex flex-col items-center px-4 pb-16">
                    <HookGenerator />
                </div>
            </div>
        </div>
    );
}
