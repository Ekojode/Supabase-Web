"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function VibeCalculatorSoft() {
    const [people, setPeople] = useState(1);
    const basePrice = 5000;
    const splitPrice = Math.round(basePrice / people);

    const getMood = () => {
        if (people === 1) return { emoji: "😐", text: "Solo, huh?" };
        if (people === 2) return { emoji: "😊", text: "Getting there!" };
        if (people === 3) return { emoji: "😃", text: "Nice squad!" };
        return { emoji: "🤩", text: "Big savings!" };
    };

    const mood = getMood();

    return (
        <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-12">
                    <h2 className="text-5xl font-black text-purple-900 mb-8 text-center">How much you saving? 💰</h2>

                    <div className="mb-12 text-center">
                        <motion.div
                            key={mood.emoji}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="text-9xl mb-4 inline-block"
                        >
                            {mood.emoji}
                        </motion.div>
                        <p className="text-2xl font-bold text-purple-700">{mood.text}</p>
                    </div>

                    <div className="mb-8">
                        <label className="block text-lg font-bold text-purple-900 mb-4 text-center">
                            Split with {people} {people === 1 ? "person" : "friends"}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="4"
                            value={people}
                            onChange={(e) => setPeople(parseInt(e.target.value))}
                            className="w-full h-4 bg-purple-100 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #C084FC 0%, #C084FC ${(people - 1) * 33.33}%, #E9D5FF ${(people - 1) * 33.33}%, #E9D5FF 100%)`
                            }}
                        />
                    </div>

                    <div className="flex justify-center gap-6">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-br from-purple-400 to-pink-400 text-white rounded-[2rem] p-8 text-center shadow-lg"
                        >
                            <p className="text-sm font-bold mb-2">You Pay</p>
                            <motion.p
                                key={splitPrice}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl font-black"
                            >
                                ₦{splitPrice.toLocaleString()}
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
