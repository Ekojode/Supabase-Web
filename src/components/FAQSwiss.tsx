"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
    { q: "Is this legal?", a: "Yes! We're a licensed platform following all regulations." },
    { q: "How secure is payment?", a: "Bank-grade encryption. Your data is protected." },
    { q: "What if someone leaves?", a: "We auto-match replacement members within 24 hours." },
];

export default function FAQSwiss() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Questions</h2>

                <div className="space-y-2">
                    {FAQ_ITEMS.map((item, i) => (
                        <div key={i} className="border-b border-slate-100">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-lg font-medium text-slate-900">{item.q}</span>
                                <motion.div
                                    animate={{ rotate: open === i ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="text-slate-400" size={20} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-6 text-slate-600 leading-relaxed">{item.a}</p>
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
