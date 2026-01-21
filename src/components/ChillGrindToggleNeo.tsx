"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    Tv,
    Music,
    Code,
    Zap,
    Sparkles,
    Coffee,
    Laptop,
    Star,
    ArrowRight,
    MessageSquare,
    Search,
    Users
} from "lucide-react";

type AppService = {
    name: string;
    icon: any;
    originalPrice: string;
    splitPrice: string;
    category: string;
};

const CHILL_APPS: AppService[] = [
    { name: "Netflix", icon: Tv, originalPrice: "₦4,400", splitPrice: "₦1,100", category: "Entertainment" },
    { name: "Spotify", icon: Music, originalPrice: "₦900", splitPrice: "₦300", category: "Music" },
    { name: "Prime Video", icon: Sparkles, originalPrice: "₦2,300", splitPrice: "₦800", category: "Entertainment" },
    { name: "YouTube Premium", icon: Zap, originalPrice: "₦1,100", splitPrice: "₦400", category: "Utility" },
    { name: "Disney+", icon: Star, originalPrice: "₦3,500", splitPrice: "₦900", category: "Entertainment" },
    { name: "Apple Music", icon: Music, originalPrice: "₦1,000", splitPrice: "₦350", category: "Music" },
];

const GRIND_APPS: AppService[] = [
    { name: "ChatGPT Plus", icon: MessageSquare, originalPrice: "₦30,000", splitPrice: "₦7,500", category: "AI Tool" },
    { name: "Canva Pro", icon: Sparkles, originalPrice: "₦2,800", splitPrice: "₦1,000", category: "Design" },
    { name: "Midjourney", icon: Zap, originalPrice: "₦15,000", splitPrice: "₦4,000", category: "AI Tool" },
    { name: "Adobe CC", icon: Laptop, originalPrice: "₦45,000", splitPrice: "₦12,000", category: "Creative" },
    { name: "Framer", icon: Code, originalPrice: "₦12,000", splitPrice: "₦3,000", category: "Design" },
    { name: "GitHub Copilot", icon: Code, originalPrice: "₦15,000", splitPrice: "₦5,000", category: "Dev Tool" },
];

export default function ChillGrindToggle() {
    const [mode, setMode] = useState<"chill" | "grind">("chill");

    const currentApps = mode === "chill" ? CHILL_APPS : GRIND_APPS;

    return (
        <section className="py-24 border-y-3 border-black bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ rotate: -5, scale: 0.9 }}
                        whileInView={{ rotate: 0, scale: 1 }}
                        className="mb-6 inline-block bg-black text-white px-6 py-2 neo-border neo-shadow font-black uppercase tracking-widest text-sm"
                    >
                        Power to the community
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-none">
                        WHAT'S YOUR <br className="md:hidden" /> <span className="text-subby-emerald">MISSION?</span>
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl bg-black neo-border p-2">
                        <button
                            onClick={() => setMode("chill")}
                            className={`flex-1 py-4 font-black text-2xl flex items-center justify-center gap-3 transition-all ${mode === "chill" ? "bg-subby-pink text-black" : "text-white hover:text-subby-pink"
                                }`}
                        >
                            <Coffee size={32} /> CHILL MODE
                        </button>
                        <button
                            onClick={() => setMode("grind")}
                            className={`flex-1 py-4 font-black text-2xl flex items-center justify-center gap-3 transition-all ${mode === "grind" ? "bg-subby-blue text-black" : "text-white hover:text-subby-blue"
                                }`}
                        >
                            <Laptop size={32} /> GRIND MODE
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                    <AnimatePresence mode="popLayout">
                        {currentApps.map((app, i) => (
                            <motion.div
                                key={app.name + mode}
                                layout
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, rotate: (i % 2 === 0 ? -2 : 2) }}
                                animate={{ opacity: 1, x: 0, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{
                                    ease: "circOut",
                                    duration: 0.5,
                                    delay: i * 0.05
                                }}
                                className={`group relative p-8 neo-border neo-shadow cursor-pointer transition-colors bg-white hover:bg-[#F4F3EF] overflow-hidden`}
                            >
                                {/* Mode-specific accent bar */}
                                <div className={`absolute top-0 left-0 w-full h-2 ${mode === "chill" ? "bg-subby-pink" : "bg-subby-blue"}`} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`w-20 h-20 flex items-center justify-center neo-border neo-shadow group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0px_#000] transition-all bg-white`}>
                                            <app.icon size={40} className={mode === "chill" ? "text-subby-pink" : "text-subby-blue"} strokeWidth={3} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="bg-black text-white px-3 py-1 text-[10px] font-mono font-black tracking-widest uppercase">
                                                {app.category}
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="w-2 h-2 bg-black rounded-full" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-black mb-2 uppercase tracking-tight group-hover:tracking-normal transition-all">{app.name}</h3>
                                    <p className="font-mono text-sm text-gray-500 mb-8 uppercase">Join 12+ active groups</p>

                                    <div className="space-y-4 mb-10 bg-black/5 p-4 neo-border border-dashed">
                                        <div className="flex justify-between items-center text-gray-500 font-mono text-sm uppercase font-bold">
                                            <span>Full Price</span>
                                            <span className="line-through">{app.originalPrice}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="font-black text-sm uppercase">Your Cut</span>
                                            <span className="text-4xl font-black font-mono leading-none tracking-tighter">
                                                {app.splitPrice}
                                            </span>
                                        </div>
                                    </div>

                                    <button className={`w-full py-4 bg-black text-white font-black uppercase text-xl neo-shadow transition-all flex items-center justify-center gap-3 relative group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none`}>
                                        Chop bill <ArrowRight size={24} />
                                    </button>
                                </div>

                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
                                    <Search size={120} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-20 flex justify-center">
                    <div className="inline-flex items-center gap-4 bg-subby-yellow neo-border neo-shadow px-8 py-4 font-black uppercase text-xl animate-bounce">
                        <Users size={28} /> Don't see your app? Suggest it!
                    </div>
                </div>
            </div>
        </section>
    );
}
