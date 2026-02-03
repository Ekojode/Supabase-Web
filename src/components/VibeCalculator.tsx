"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function VibeCalculator() {
    const [people, setPeople] = useState(2);
    const basePrice = 5500; // Average Netflix Premium Price
    const splitPrice = Math.round(basePrice / people);
    const savings = basePrice - splitPrice;

    // Calculate percentage for slider background
    const sliderPercent = ((people - 1) / 5) * 100;

    return (
        <section id="pricing" className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-[#1A1A2E] mb-6">
                        See what you <span className="text-[#4CBBB9]">save</span>
                    </h2>
                    <p className="text-[#3A5369]/70 text-lg">
                        Stop paying full price for family plans you don't use alone.
                    </p>
                </div>

                {/* Calculator Interface */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 md:p-12">

                    {/* Controls */}
                    <div className="mb-16 max-w-lg mx-auto">
                        <div className="flex justify-between items-end mb-8">
                            <label className="text-sm font-bold uppercase tracking-widest text-[#3A5369]">
                                Sharing with
                            </label>
                            <div className="text-3xl font-bold text-[#1A1A2E]">
                                {people} <span className="text-lg text-[#3A5369]/50 font-medium">friends</span>
                            </div>
                        </div>

                        {/* Custom Slider */}
                        <div className="relative h-2 w-full bg-gray-200 rounded-full">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#1A1A2E] rounded-full"
                                style={{ width: `${sliderPercent}%` }}
                            />
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={people}
                                onChange={(e) => setPeople(parseInt(e.target.value))}
                                className="absolute top-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer z-20"
                            />
                            {/* Thumb (Visual Only) */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-[#1A1A2E] rounded-full shadow-lg pointer-events-none z-10 transition-all duration-75"
                                style={{ left: `calc(${sliderPercent}% - 16px)` }}
                            />
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-medium text-[#3A5369]/40 font-mono">
                            <span>1</span>
                            <span>6</span>
                        </div>
                    </div>

                    {/* Results Grid - Geometric & Sharp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">

                        {/* Cost Per Person */}
                        <div className="bg-white p-8 md:p-12 flex flex-col items-center justify-center text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-[#3A5369] mb-4">
                                You Pay
                            </p>
                            <motion.div
                                key={splitPrice}
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="text-5xl md:text-6xl font-bold text-[#1A1A2E] tracking-tight"
                            >
                                <span className="text-3xl align-top text-[#3A5369]/40 font-medium mr-1">₦</span>
                                {splitPrice.toLocaleString()}
                                <span className="text-lg text-[#3A5369]/40 font-medium ml-1">/mo</span>
                            </motion.div>
                        </div>

                        {/* Total Savings */}
                        <div className="bg-[#1A1A2E] p-8 md:p-12 flex flex-col items-center justify-center text-center text-white">
                            <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">
                                You Save
                            </p>
                            <motion.div
                                key={savings}
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="text-5xl md:text-6xl font-bold text-[#4CBBB9] tracking-tight"
                            >
                                <span className="text-3xl align-top text-white/40 font-medium mr-1">₦</span>
                                {savings.toLocaleString()}
                                <span className="text-lg text-white/40 font-medium ml-1">/mo</span>
                            </motion.div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-[#3A5369]/40 mt-8">
                        Based on Netflix Premium pricing (₦{basePrice.toLocaleString()}/mo)
                    </p>

                </div>
            </div>
        </section>
    );
}
