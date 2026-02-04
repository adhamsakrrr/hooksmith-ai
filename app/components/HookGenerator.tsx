'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PlatformSelector, Platform } from './PlatformSelector';
import { HookCard } from './HookCard';

export default function HookGenerator() {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState<Platform>('twitter');
    const [hooks, setHooks] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const generateHooks = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setHooks([]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, platform }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }

            try {
                const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanResult);
                setHooks(Array.isArray(parsed) ? parsed : [result]);
            } catch (e) {
                console.error("JSON Parse error", e);
                setHooks(result.split('\n').filter(line => line.length > 5));
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            generateHooks();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Glassmorphic Container */}
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
                {/* Platform Selector */}
                <div className="mb-6">
                    <PlatformSelector selected={platform} onSelect={(p) => setPlatform(p)} />
                </div>

                {/* Input Section */}
                <div className="space-y-2">
                    <label
                        htmlFor="topic-input"
                        className="block text-xs uppercase tracking-wider text-gray-400 font-sans"
                    >
                        What's your topic?
                    </label>
                    <div className="relative">
                        <input
                            id="topic-input"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., AI in healthcare, fitness tips, productivity hacks..."
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-4 pr-32 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors font-sans"
                        />
                        <button
                            onClick={generateHooks}
                            disabled={loading || !topic.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg shadow-purple-500/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                            ) : (
                                <span className="font-medium text-white">Generate</span>
                            )}
                        </button>
                    </div>
                    {/* Mobile Generate Button */}
                    <button
                        onClick={generateHooks}
                        disabled={loading || !topic.trim()}
                        className="md:hidden w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                        ) : (
                            <span className="font-medium text-white">Generate Hooks</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Result Cards */}
            {hooks.length > 0 && (
                <div className="space-y-4 font-sans">
                    {hooks.map((hook, index) => (
                        <HookCard key={index} text={hook} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
