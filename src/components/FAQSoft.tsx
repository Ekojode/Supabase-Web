"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const FAQ_ITEMS = [
    { q: "Is this safe? 🔒", a: "Super safe! Bank-level security got you covered.", color: "#C084FC" },
    { q: "How fast is setup? ⚡", a: "Like 2 minutes. Seriously.", color: "#86EFAC" },
    { q: "Can I cancel anytime? 🚪", a: "Yup! No strings attached, promise.", color: "#FDA4AF" },
];

export default function FAQSoft() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#FFFDF5]">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-5xl font-black text-purple-900 mb-12 text-center">Got Questions? 🤔</h2>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setOpen(open === i ? null : i)}
                            style={{ backgroundColor: open === i ? item.color : "#FFFFFF" }}
                            className="rounded-[2rem] p-6 shadow-lg cursor-pointer transition-all"
                        >
                            <p className="text-xl font-black text-purple-900 mb-2">{item.q}</p>
                            {open === i && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-purple-800 font-bold"
                                >
                                    {item.a}
                                </motion.p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
