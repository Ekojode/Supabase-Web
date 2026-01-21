"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NavbarSwiss() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-6 flex justify-between items-center max-w-5xl">
                <div className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                    Subby.
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
                    <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</a>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
                        Join Waitlist <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
