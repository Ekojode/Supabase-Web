"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function VibeCalculatorSwiss() {
    const [people, setPeople] = useState(1);
    const basePrice = 5000;
    const splitPrice = Math.round(basePrice / people);
    const savings = basePrice - splitPrice;

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-2xl p-12 border border-slate-100">
                    <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Calculate Your Savings</h2>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-600 mb-4">
                            Split with {people} {people === 1 ? "person" : "people"}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="4"
                            value={people}
                            onChange={(e) => setPeople(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(people - 1) * 33.33}%, #E2E8F0 ${(people - 1) * 33.33}%, #E2E8F0 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-6 bg-slate-50 rounded-lg">
                            <p className="text-sm font-medium text-slate-600 mb-2">You Pay</p>
                            <motion.p
                                key={splitPrice}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-bold text-blue-600 font-mono tabular-nums"
                            >
                                ₦{splitPrice.toLocaleString()}
                            </motion.p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-slate-600 mb-2">You Save</p>
                            <motion.p
                                key={savings}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-bold text-blue-600 font-mono tabular-nums"
                            >
                                ₦{savings.toLocaleString()}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
