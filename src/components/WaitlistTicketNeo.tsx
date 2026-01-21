"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Ticket, ArrowDown, Scissors, ShieldCheck, Zap } from "lucide-react";

export default function WaitlistTicket() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <section className="py-32 relative overflow-hidden bg-[#F4F3EF] border-t-3 border-black">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />

            <div className="container mx-auto px-6 max-w-3xl relative z-10">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="ticket"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            exit={{
                                y: 800,
                                rotate: 15,
                                opacity: 0,
                                transition: { type: "spring", damping: 12, stiffness: 100 }
                            }}
                            className="relative"
                        >
                            {/* Floating Label */}
                            <div className="absolute -top-6 -right-6 z-20 bg-subby-emerald text-black neo-border neo-shadow px-4 py-2 font-black uppercase rotate-12 flex items-center gap-2">
                                <Zap size={20} fill="black" /> 99% Savings
                            </div>

                            {/* Perforated Ticket Design */}
                            <div
                                className="bg-subby-yellow neo-border border-dashed border-4 p-8 md:p-16 neo-shadow relative group"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {/* Perforation holes */}
                                <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#F4F3EF] rounded-full neo-border" />
                                <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#F4F3EF] rounded-full neo-border" />

                                {/* Scissors Icon on Perforation */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Scissors className="rotate-90" />
                                </div>

                                <div className="text-center mb-12">
                                    <div className="flex justify-center gap-2 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 bg-black rounded-full" />
                                        ))}
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
                                        GET THE <br /> <span className="bg-black text-white px-4">CHOP CARD</span>
                                    </h2>
                                    <p className="text-xl font-bold uppercase tracking-widest text-black/60">Limited Access • Beta Batch 01</p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md mx-auto">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                                        <input
                                            type="email"
                                            placeholder="YOUR_EMAIL@HERE.COM"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white neo-border p-5 pl-14 text-2xl font-black placeholder:text-gray-300 focus:outline-none focus:ring-4 ring-subby-emerald/20 transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-black text-white text-3xl font-black py-6 neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 transition-all uppercase flex items-center justify-center gap-4 group"
                                    >
                                        SECURE SPOT <ArrowDown className="group-hover:translate-y-1 transition-transform" />
                                    </button>
                                </form>

                                <div className="mt-16 pt-12 border-t-4 border-black border-dashed flex flex-col md:flex-row justify-between items-center gap-6 font-mono font-black text-sm text-black/50 overflow-hidden">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={20} /> VERIFIED SUBSCRIPTION SPLITTING
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="bg-black text-white px-2">TX: #00234-LGS</span>
                                        <span className="animate-pulse">● LIVE</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="text-center p-16 bg-subby-emerald neo-border neo-shadow relative"
                        >
                            {/* Confetti-like elements */}
                            <div className="absolute top-4 left-4 rotate-45"><Zap fill="black" /></div>
                            <div className="absolute bottom-4 right-4 -rotate-45"><Zap fill="black" /></div>

                            <Ticket size={100} className="mx-auto mb-8 animate-bounce" />
                            <h2 className="text-6xl font-black mb-6 tracking-tighter">YOU'RE IN THE SQUAD!</h2>
                            <p className="text-2xl font-bold uppercase mb-12">We've reserved your slot. <br /> Check your email for the next steps.</p>

                            <button
                                onClick={() => setSubmitted(false)}
                                className="bg-black text-white px-8 py-4 font-black uppercase text-xl hover:bg-white hover:text-black transition-colors neo-border"
                            >
                                Back to start
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wallet Slot Visual */}
                <div className="mt-20 w-full h-4 bg-black/10 rounded-full blur-sm" />
            </div>

            <style jsx global>{`
        .bg-noise {
          background-image: url("/noise.svg");
        }
      `}</style>
        </section>
    );
}
