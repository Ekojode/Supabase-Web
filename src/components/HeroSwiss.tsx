"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSwiss() {
    return (
        <section className="min-h-[85vh] flex flex-col justify-center pt-32 pb-20 relative overflow-hidden">

            {/* Decorative Blur Top Right */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

            <div className="container mx-auto px-8 relative z-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-8 pl-4 border-l border-slate-200"
                        >
                            <span className="text-xs font-semibold tracking-[0.2em] text-blue-700 uppercase">
                                The New Standard
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-slate-900 mb-8 leading-[0.95]">
                            Share costs.<br />
                            <span className="text-slate-400">Keep access.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 max-w-lg mb-12 leading-relaxed font-light tracking-tight">
                            Subby automates subscription splitting with bank-grade precision.
                        </p>

                        <div className="flex items-center gap-6">
                            <button className="bg-[#002FA7] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#00227a] transition-all shadow-[0_20px_40px_-12px_rgba(0,47,167,0.3)] flex items-center gap-3 group">
                                Start Splitting
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="text-slate-600 px-6 py-4 text-sm font-medium hover:text-slate-900 transition-colors border-b border-transparent hover:border-slate-300">
                                View Documentation
                            </button>
                        </div>
                    </div>

                    {/* Right Visual - Architectural Glass Card */}
                    <div className="relative h-[600px] w-full flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-md aspect-[3/4] bg-white rounded-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col p-12 relative overflow-hidden"
                        >
                            {/* Abstract Financial Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#002FA7]/5 blur-3xl rounded-full" />

                            <div className="flex justify-between items-end mb-24 relative z-10">
                                <div className="text-[#002FA7] font-semibold tracking-widest text-xs uppercase">Current Yield</div>
                                <div className="text-4xl font-light tracking-tighter text-slate-900">12.4%</div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                                                {i === 1 ? 'N' : i === 2 ? 'S' : 'A'}
                                            </div>
                                            <div className="w-24 h-2 bg-slate-100 rounded-full" />
                                        </div>
                                        <div className="w-12 h-2 bg-blue-50 rounded-full" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto relative z-10">
                                <div className="w-full h-12 bg-[#002FA7] text-white flex items-center justify-center text-sm font-medium tracking-wide">
                                    CONFIRM TRANSFER
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
