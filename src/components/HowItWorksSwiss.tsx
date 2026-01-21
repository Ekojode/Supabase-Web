"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CreditCard, Key, ListPlus, Users, Wallet } from "lucide-react";
import { useState } from "react";

const JOIN_STEPS = [
    { title: "Browse & Join", description: "Pick a 'Chop Group' for your favorite app.", icon: UserPlus },
    { title: "Pay Your Split", description: "Securely pay your fraction in Naira.", icon: CreditCard },
    { title: "Access Instantly", description: "Get credentials delivered immediately.", icon: Key }
];

const LIST_STEPS = [
    { title: "List Your Sub", description: "Have a family plan? List it.", icon: ListPlus },
    { title: "Get Matched", description: "We fill your empty slots automatically.", icon: Users },
    { title: "Get Paid", description: "Receive cash into your wallet.", icon: Wallet }
];

export default function HowItWorksSwiss() {
    const [flow, setFlow] = useState<"join" | "list">("join");
    const currentSteps = flow === "join" ? JOIN_STEPS : LIST_STEPS;

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 max-w-5xl">

                {/* Segmented Control (Apple Style) */}
                <div className="flex flex-col items-center mb-16">
                    <div className="inline-flex bg-slate-200 p-1 rounded-full mb-12">
                        <button
                            onClick={() => setFlow("join")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${flow === "join" ? "bg-white text-slate-900 shadow-md" : "text-slate-600"
                                }`}
                        >
                            I Want to Join
                        </button>
                        <button
                            onClick={() => setFlow("list")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${flow === "list" ? "bg-white text-slate-900 shadow-md" : "text-slate-600"
                                }`}
                        >
                            I Want to List
                        </button>
                    </div>

                    <h2 className="text-5xl font-bold text-slate-900 tracking-tight">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <AnimatePresence mode="wait">
                        {currentSteps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 flex items-center justify-center mb-6">
                                    <step.icon size={32} className="text-blue-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
