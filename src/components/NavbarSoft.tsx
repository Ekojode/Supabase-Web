"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function NavbarSoft() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="bg-white/90 px-8 py-3 rounded-full flex items-center gap-8 shadow-xl shadow-purple-900/5 pointer-events-auto transition-transform hover:scale-105 duration-300">
                <div className="text-2xl font-black text-purple-900 font-sans flex items-center gap-1">
                    <span className="text-3xl">🥯</span> subby
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <a href="#" className="font-bold text-sm text-purple-800/60 hover:text-purple-900">Apps</a>
                    <a href="#" className="font-bold text-sm text-purple-800/60 hover:text-purple-900">Squads</a>
                </div>

                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:-translate-y-1">
                    Get Early Access
                </button>
            </div>
        </nav>
    );
}
