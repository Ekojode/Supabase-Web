"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Square, Type, Circle } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: "neo", label: "NEO", icon: Square, color: "#FACC15" },
        { id: "swiss", label: "SWISS", icon: Type, color: "#E2E8F0" },
        { id: "soft", label: "SOFT", icon: Circle, color: "#FFC0CB" },
    ] as const;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
            <div className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg dark:bg-black/80 dark:border-gray-800">
                {themes.map((t) => {
                    const isActive = theme === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${isActive ? "text-black" : "text-gray-500 hover:text-black"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTheme"
                                    className="absolute inset-0 bg-white rounded-full neo-shadow border border-black"
                                    style={{ backgroundColor: t.color }}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <t.icon size={14} />
                                {t.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
