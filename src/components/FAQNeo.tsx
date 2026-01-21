"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQS = [
    {
        question: "How does splitting actually work?",
        answer: "Subby creates a secure 'Chop Group'. You join, contribute your fraction of the bill in Naira, and we handle the payment to the service provider. Everyone gets access, no one pays full price."
    },
    {
        question: "Is it safe to share my account?",
        answer: "Absolutely. We use invite-only systems for family/group plans. Your personal data remains yours—we only manage the bill splitting and group access credentials."
    },
    {
        question: "Can I pay in Naira?",
        answer: "Yes! That's our superpower. We accept all Nigerian cards, bank transfers, and USSD. No more worrying about dollar limits or international transaction fees."
    },
    {
        question: "What if someone leaves the group?",
        answer: "The 'Chop Card' is flexible. If someone leaves, the slot opens back up for the community. You only ever pay your split; we fill the gaps."
    },
    {
        question: "Which apps can I split?",
        answer: "Everything from Netflix and Spotify to business tools like ChatGPT Plus, Canva, and Adobe. If it's a subscription, we can chop it."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-32 bg-white border-b-3 border-black relative overflow-hidden">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('/grid.svg')] bg-repeat" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="flex flex-col items-center mb-20 text-center">
                    <div className="bg-subby-emerald text-black neo-border neo-shadow px-6 py-2 font-black uppercase mb-6 rotate-[-2deg]">
                        Got Questions?
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        THE <span className="text-subby-yellow">INTEL</span> <br /> YOU NEED
                    </h2>
                </div>

                <div className="space-y-6">
                    {FAQS.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="neo-border neo-shadow bg-[#F4F3EF] overflow-hidden group"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-8 flex justify-between items-center text-left hover:bg-white transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="font-mono text-xl font-black opacity-20">0{i + 1}</span>
                                    <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight">{faq.question}</h3>
                                </div>
                                <div className={`w-12 h-12 flex items-center justify-center neo-border transition-all ${openIndex === i ? 'bg-black text-white' : 'bg-subby-yellow text-black'}`}>
                                    {openIndex === i ? <Minus size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "circOut" }}
                                    >
                                        <div className="px-8 pb-8 pt-0 md:pl-24">
                                            <div className="border-l-4 border-black pl-8">
                                                <p className="text-xl font-bold text-gray-700 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 bg-black text-white p-10 neo-border neo-shadow relative">
                    <HelpCircle size={64} className="text-subby-yellow animate-pulse" />
                    <div className="text-center md:text-left">
                        <h4 className="text-3xl font-black uppercase mb-2">Still confused?</h4>
                        <p className="font-bold opacity-60">Reach out to our community managers on WhatsApp.</p>
                    </div>
                    <button className="bg-subby-emerald text-black px-8 py-4 font-black uppercase text-xl neo-border hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                        CHAT WITH US
                    </button>
                </div>
            </div>
        </section>
    );
}
