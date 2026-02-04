import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface HookCardProps {
    text: string;
    index: number;
}

export function HookCard({ text, index }: HookCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative bg-[#0F0F0F] border border-gray-800 rounded-lg p-6 hover:border-gray-700 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
        >
            <p className="text-white text-lg leading-relaxed pr-8">{text}</p>
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-md bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-700"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                )}
            </button>
        </motion.div>
    );
}
