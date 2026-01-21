"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tv, Music, Scissors, Camera } from "lucide-react";

const APPS = {
    chill: [
        { name: "Netflix", price: "₦1,100", icon: Tv, slots: "2/4" },
        { name: "Spotify", price: "₦300", icon: Music, slots: "1/4" },
    ],
    grind: [
        { name: "Adobe CC", price: "₦2,400", icon: Scissors, slots: "3/5" },
        { name: "Canva Pro", price: "₦800", icon: Camera, slots: "2/5" },
    ],
};

export default function ChillGrindToggleSwiss() {
    const [mode, setMode] = useState<"chill" | "grind">("chill");
    const apps = mode === "chill" ? APPS.chill : APPS.grind;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900">Browse Groups</h2>

                    <div className="inline-flex bg-slate-100 p-1 rounded-full">
                        <button
                            onClick={() => setMode("chill")}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === "chill" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                                }`}
                        >
                            Entertainment
                        </button>
                        <button
                            onClick={() => setMode("grind")}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === "grind" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                                }`}
                        >
                            Productivity
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apps.map((app) => (
                        <motion.div
                            key={app.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                                    <app.icon size={24} className="text-blue-600" strokeWidth={1.5} />
                                </div>
                                <span className="text-xs font-medium text-slate-500">{app.slots} filled</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{app.name}</h3>
                            <p className="text-2xl font-bold text-blue-600">{app.price}<span className="text-sm text-slate-500">/mo</span></p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
