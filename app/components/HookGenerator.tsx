'use client';

import { useState } from 'react';
import { Loader2, Copy, Check, Twitter, Linkedin, Hash, Sparkles } from 'lucide-react';
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

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const platforms = [
        { id: 'twitter', icon: Twitter, label: 'Twitter / X' },
        { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
        { id: 'tiktok', icon: Hash, label: 'TikTok / Shorts' },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            {/* Input Section */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-1 shadow-2xl overflow-hidden"
            >
                <div className="p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Target Platform</label>
                        </div>
                        <div className="flex gap-2">
                            {platforms.map((p) => {
                                const Icon = p.icon;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setPlatform(p.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${platform === p.id
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="hidden sm:inline">{p.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">What's your content about?</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Remote Work, AI Tools, Vegan Diet..."
                                className="w-full bg-black/50 border border-gray-700 rounded-2xl px-6 py-5 text-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all group-hover:border-gray-600"
                                onKeyDown={(e) => e.key === 'Enter' && generateHooks()}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generateHooks}
                                disabled={loading || !topic}
                                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Generate</>}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Results Section */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {hooks.map((hook, index) => (
                        <motion.div
                            key={`${hook}-${index}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group relative bg-[#0F0F0F] border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
                        >
                            <p className="text-gray-200 text-lg leading-relaxed font-light">{hook}</p>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => copyToClipboard(hook, index)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    {copiedIndex === index ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            <Check size={18} className="text-green-400" />
                                        </motion.div>
                                    ) : (
                                        <Copy size={18} />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
