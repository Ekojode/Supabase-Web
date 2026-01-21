"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const APPS = {
    chill: [
        { name: "Netflix", price: "₦1,100", emoji: "📺", slots: "2/4", color: "#FDA4AF" },
        { name: "Spotify", price: "₦300", emoji: "🎵", slots: "1/4", color: "#86EFAC" },
    ],
    grind: [
        { name: "Adobe CC", price: "₦2,400", emoji: "✂️", slots: "3/5", color: "#C084FC" },
        { name: "Canva Pro", price: "₦800", emoji: "📷", slots: "2/5", color: "#FDE047" },
    ],
};

export default function ChillGrindToggleSoft() {
    const [mode, setMode] = useState<"chill" | "grind">("chill");
    const apps = mode === "chill" ? APPS.chill : APPS.grind;

    return (
        <section className="py-24 bg-[#FFFDF5]">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-5xl font-black text-purple-900 mb-8">Pick Your Vibe</h2>

                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: mode === "chill" ? 1 : 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMode("chill")}
                            className={`text-6xl transition-all ${mode === "chill" ? "scale-125" : "opacity-40"}`}
                        >
                            🎬
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: mode === "grind" ? 1 : 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMode("grind")}
                            className={`text-6xl transition-all ${mode === "grind" ? "scale-125" : "opacity-40"}`}
                        >
                            💼
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apps.map((app, i) => (
                        <motion.div
                            key={app.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            style={{ backgroundColor: app.color }}
                            className="rounded-[2rem] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                        >
                            <div className="text-5xl mb-4">{app.emoji}</div>
                            <h3 className="text-2xl font-black text-purple-900 mb-2">{app.name}</h3>
                            <p className="text-3xl font-black text-purple-900 mb-2">{app.price}<span className="text-sm">/mo</span></p>
                            <p className="text-sm font-bold text-purple-800/60">{app.slots} spots filled</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
