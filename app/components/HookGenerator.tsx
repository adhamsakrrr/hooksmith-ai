'use client';

import { useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HookGenerator() {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('twitter');
    const [hooks, setHooks] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generateHooks = async () => {
        if (!topic) return;
        setLoading(true);
        setHooks([]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, platform }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            // stream reading logic
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                result += chunk;
                // In a real stream, we'd parse partially, but for JSON array, we likely wait for full.
                // However, to make it "magical", we should try to parse or show progress.
                // Given the prompt returns a JSON ARRAY, streaming parsing is tricky without a library.
                // For MVP, we'll accumulate and then parse. 
                // OPTIMIZATION: We could prompt for newline separated strings to stream line-by-line.
                // But let's just wait for full response for V1 safely.
            }

            try {
                // AI sometimes wraps in markdown ```json ... ```
                const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanResult);
                if (Array.isArray(parsed)) {
                    setHooks(parsed);
                } else {
                    setHooks([result]); // Fallback
                }
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

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. AI Tools, Remote Work, Healthy Eating"
                            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            onKeyDown={(e) => e.key === 'Enter' && generateHooks()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
                        <div className="flex gap-2">
                            {['twitter', 'linkedin', 'tiktok'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPlatform(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${platform === p
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={generateHooks}
                        disabled={loading || !topic}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Generate Viral Hooks'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {hooks.map((hook, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex items-start justify-between group hover:border-gray-700 transition"
                        >
                            <p className="text-gray-200 leading-relaxed">{hook}</p>
                            <button
                                onClick={() => copyToClipboard(hook, index)}
                                className="ml-4 p-2 text-gray-500 hover:text-white transition rounded-lg hover:bg-gray-800"
                            >
                                {copiedIndex === index ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
