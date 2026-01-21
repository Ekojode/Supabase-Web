"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function WaitlistTicketSwiss() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
                <div className="container mx-auto px-6 max-w-md">
                    <motion.div
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-blue-600 to-slate-800 rounded-2xl p-12 text-center shadow-2xl"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div style={{ transform: "rotateY(180deg)" }}>
                            <h3 className="text-3xl font-bold mb-4">You're In.</h3>
                            <p className="text-blue-200 mb-4">Member #{Math.floor(Math.random() * 9999)}</p>
                            <p className="text-sm text-blue-300">We'll notify you when we launch.</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <div className="container mx-auto px-6 max-w-md">
                <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-12 border border-slate-700 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-center">Join the Waitlist</h2>
                    <p className="text-blue-200 mb-8 text-center">Be first to access exclusive deals.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2"
                            >
                                Join <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
