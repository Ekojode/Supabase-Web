"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STEPS = [
    {
        id: "01",
        title: "Choose Service",
        desc: "Pick Netflix, Spotify, or Apple Music.",
        color: "bg-[#4CBBB9]"
    },
    {
        id: "02",
        title: "Join Group",
        desc: "Find a spot or start your own.",
        color: "bg-[#3A5369]"
    },
    {
        id: "03",
        title: "Pay & Access",
        desc: "Secure payment, instant login.",
        color: "bg-[#1A1A2E]"
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 relative overflow-hidden">

            {/* Background Line Connector */}
            <div className="absolute top-[50%] left-0 w-full h-[1px] bg-gray-100 -z-10 hidden md:block" />

            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative group"
                        >
                            {/* Connector Arrow (Desktop Only) */}
                            {i < 2 && (
                                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-1 text-gray-300">
                                    <ArrowRight size={16} />
                                </div>
                            )}

                            {/* Number Tag */}
                            <div className={`w-12 h-12 ${step.color} text-white font-bold font-mono text-lg rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                                {step.id}
                            </div>

                            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
                                {step.title}
                            </h3>
                            <p className="text-[#3A5369]/70 text-sm leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
