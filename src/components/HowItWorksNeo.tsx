"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, CreditCard, Key, ListPlus, Users, Wallet } from "lucide-react";
import { useState } from "react";

const JOIN_STEPS = [
    {
        title: "BROWSE & JOIN",
        description: "Pick a 'Chop Group' for your favorite app. Netflix, Spotify, or Adobe—we have open slots waiting.",
        icon: UserPlus,
        color: "#FACC15"
    },
    {
        title: "PAY YOUR SPLIT",
        description: "Securely pay your fraction of the bill in Naira. No hidden fees, just your fair share.",
        icon: CreditCard,
        color: "#10B981"
    },
    {
        title: "ACCESS INSTANTLY",
        description: "Get the login credentials delivered to your dashboard immediately. Start chopping.",
        icon: Key,
        color: "#A7C7E7"
    }
];

const LIST_STEPS = [
    {
        title: "LIST YOUR SUB",
        description: "Have a family plan? List it on Subby. Set your price and available slots in seconds.",
        icon: ListPlus,
        color: "#FFC0CB"
    },
    {
        title: "GET MATCHED",
        description: "We automatically fill your empty slots with verified, paying community members.",
        icon: Users,
        color: "#A7C7E7"
    },
    {
        title: "GET PAID",
        description: "Receive your cash instantly into your wallet. No chasing people for money.",
        icon: Wallet,
        color: "#FACC15"
    }
];

export default function HowItWorks() {
    const [flow, setFlow] = useState<"join" | "list">("join");
    const currentSteps = flow === "join" ? JOIN_STEPS : LIST_STEPS;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-20 text-center">

                    {/* Toggle Switch */}
                    <div className="flex bg-[#F4F3EF] neo-border p-1 mb-16 rounded-full relative shadow-inner">
                        <button
                            onClick={() => setFlow("join")}
                            className={`relative z-10 px-8 py-3 rounded-full font-black uppercase transition-all duration-300 ${flow === "join" ? "text-white" : "text-gray-400 hover:text-black"}`}
                        >
                            I Want to Join
                        </button>
                        <button
                            onClick={() => setFlow("list")}
                            className={`relative z-10 px-8 py-3 rounded-full font-black uppercase transition-all duration-300 ${flow === "list" ? "text-white" : "text-gray-400 hover:text-black"}`}
                        >
                            I Want to List
                        </button>

                        {/* Sliding Background */}
                        <motion.div
                            layout
                            className="absolute top-1 bottom-1 bg-black rounded-full"
                            initial={false}
                            animate={{
                                left: flow === "join" ? "4px" : "50%",
                                width: "calc(50% - 4px)",
                                x: flow === "join" ? 0 : 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                        HOW IT <span className="text-subby-emerald">WORKS</span>
                    </h2>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 min-h-[400px]">

                    {/* Connecting Line (Desktop) - Smooth Opacity Fade */}
                    <div className="hidden md:block absolute top-[100px] left-[16%] right-[16%] h-2 bg-[#F4F3EF] z-0 overflow-hidden rounded-full">
                        <motion.div
                            key={flow} // Re-triggers animation on flow change
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
                            className="w-full h-full bg-black"
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {currentSteps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ delay: i * 0.15, ease: "backOut", duration: 0.5 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                {/* Step Number Badge */}
                                <div className="absolute -top-6 -right-6 md:right-12 w-12 h-12 bg-black text-white flex items-center justify-center font-black rounded-full neo-border z-20 group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>

                                {/* Icon Circle */}
                                <div
                                    className="w-48 h-48 rounded-full neo-border neo-shadow flex items-center justify-center mb-8 bg-white transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
                                    style={{ backgroundColor: step.color }}
                                >
                                    <step.icon size={64} strokeWidth={2.5} className="text-black" />
                                </div>

                                <h3 className="text-3xl font-black uppercase mb-4 tracking-tight">{step.title}</h3>
                                <p className="font-bold text-gray-600 max-w-xs leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
