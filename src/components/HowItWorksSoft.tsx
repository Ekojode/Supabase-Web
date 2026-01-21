"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const JOIN_STEPS = [
    { title: "Browse & Join", description: "Pick a group for your favorite app 🎯", emoji: "🔍", color: "#C084FC" },
    { title: "Pay Split", description: "Pay your share in Naira 💰", emoji: "💳", color: "#86EFAC" },
    { title: "Access Now", description: "Get your login instantly ⚡", emoji: "🎉", color: "#FDA4AF" }
];

const LIST_STEPS = [
    { title: "List Your Sub", description: "Got extra seats? Share them! 🎁", emoji: "📝", color: "#FDA4AF" },
    { title: "Get Matched", description: "We find your squad automatically 🤝", emoji: "✨", color: "#86EFAC" },
    { title: "Get Paid", description: "Money hits your wallet 💜", emoji: "💸", color: "#C084FC" }
];

export default function HowItWorksSoft() {
    const [flow, setFlow] = useState<"join" | "list">("join");
    const currentSteps = flow === "join" ? JOIN_STEPS : LIST_STEPS;

    return (
        <section className="py-24 bg-[#FFFDF5]">
            <div className="container mx-auto px-6 max-w-5xl">

                {/* Big Squishy Toggle */}
                <div className="flex flex-col items-center mb-16">
                    <div className="inline-flex gap-3 mb-12">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFlow("join")}
                            className={`px-8 py-4 rounded-[2rem] font-black text-sm transition-all ${flow === "join"
                                    ? "bg-purple-500 text-white shadow-[0_8px_16px_rgba(147,51,234,0.3)]"
                                    : "bg-white text-purple-900 shadow-md"
                                }`}
                        >
                            I Want to Join 🙋
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFlow("list")}
                            className={`px-8 py-4 rounded-[2rem] font-black text-sm transition-all ${flow === "list"
                                    ? "bg-purple-500 text-white shadow-[0_8px_16px_rgba(147,51,234,0.3)]"
                                    : "bg-white text-purple-900 shadow-md"
                                }`}
                        >
                            I Want to List 💼
                        </motion.button>
                    </div>

                    <h2 className="text-5xl font-black text-purple-900">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatePresence mode="wait">
                        {currentSteps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    delay: i * 0.1,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }}
                                className="flex flex-col items-center text-center"
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                                    className="text-8xl mb-4"
                                >
                                    {step.emoji}
                                </motion.div>
                                <div className="bg-white px-6 py-8 rounded-[2rem] shadow-[8px_8px_16px_rgba(0,0,0,0.05)]">
                                    <h3 className="text-2xl font-black text-purple-900 mb-3">{step.title}</h3>
                                    <p className="text-sm font-bold text-purple-800/60">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
