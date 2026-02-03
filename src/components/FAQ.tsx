"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQ_ITEMS = [
    {
        q: "How does Subbay saving work?",
        a: "We group 5-6 verified users into a single family plan. Instead of paying ₦4,500/mo alone, you split it and pay ~₦1,100/mo.",
    },
    {
        q: "Is it safe to share my subscription?",
        a: "Completely. We manage credentials securely and ensure every member is verified. You never deal with payments or chasing people for money—we handle that.",
    },
    {
        q: "When are you launching?",
        a: "We are currently in beta and accepting early access requests. Join the waitlist to be notified as soon as we open new groups.",
    },
    {
        q: "Which subscriptions will be available?",
        a: "We're starting with Netflix, Spotify, YouTube Premium, Apple Music, and Canva Pro. More services will be added based on user demand.",
    },
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-3xl">

                <div className="mb-16 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-2">
                        Common Questions
                    </h2>
                    <p className="text-[#3A5369]/70">
                        Everything you need to know about the platform.
                    </p>
                </div>

                <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                    {FAQ_ITEMS.map((item, i) => (
                        <div key={i} className="py-2">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors px-4 rounded-xl group"
                            >
                                <span className="text-lg font-bold text-[#1A1A2E] group-hover:text-[#4CBBB9] transition-colors">
                                    {item.q}
                                </span>
                                <div className={`ml-4 flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}>
                                    {open === i ? (
                                        <Minus size={20} className="text-[#4CBBB9]" />
                                    ) : (
                                        <Plus size={20} className="text-[#1A1A2E]" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-6 px-4 text-[#3A5369]/70 leading-relaxed max-w-2xl">
                                            {item.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
