import { Linkedin, Video } from "lucide-react";
import { XLogo } from "./XLogo";

export type Platform = "twitter" | "linkedin" | "tiktok";

interface PlatformSelectorProps {
    selected: Platform | string;
    onSelect: (platform: Platform) => void;
}

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
    const platforms: { id: Platform; icon: any; label: string }[] = [
        { id: "twitter", icon: XLogo, label: "X" },
        { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
        { id: "tiktok", icon: Video, label: "TikTok" },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full">
            {platforms.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg
            border transition-all duration-200
            ${selected === id
                            ? "bg-purple-600 border-purple-600 shadow-lg shadow-purple-500/20"
                            : "bg-transparent border-gray-700 hover:border-gray-600"
                        }
          `}
                >
                    <Icon className="w-5 h-5 text-white" />
                    <span className="hidden sm:inline text-white">{label}</span>
                </button>
            ))}
        </div>
    );
}
