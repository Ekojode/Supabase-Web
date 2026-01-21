"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function VibeCalculator() {
    const [people, setPeople] = useState(1);
    const basePrice = 4500;
    const currentPrice = Math.floor(basePrice / people);
    const controls = useAnimation();

    useEffect(() => {
        if (people === 4) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#FACC15", "#10B981", "#000000"]
            });
        }
        controls.start({
            scale: [1, 1.1, 1],
            transition: { duration: 0.2 }
        });
    }, [people, controls]);

    return (
        <section className="py-24 bg-[url('/grid.svg')] bg-repeat">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white neo-border neo-shadow p-8 md:p-12">
                    <h2 className="text-4xl md:text-6xl font-black mb-12 text-center">
                        How many people <br /> splitting?
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Pie Chart Simulation */}
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                {[...Array(4)].map((_, i) => {
                                    const sliceSize = 100 / people;
                                    const dashArray = `${i < people ? sliceSize : 0} ${100 - (i < people ? sliceSize : 0)}`;
                                    const dashOffset = -(i * sliceSize);

                                    return (
                                        <circle
                                            key={i}
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            stroke={i % 2 === 0 ? "#FACC15" : "#10B981"}
                                            strokeWidth="15"
                                            strokeDasharray={dashArray}
                                            strokeDashoffset={dashOffset}
                                            className="transition-all duration-500 ease-in-out"
                                            style={{ stroke: i < people ? "" : "transparent" }}
                                        />
                                    );
                                })}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="black" strokeWidth="2" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black">{people}</span>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="mb-12">
                                <input
                                    type="range"
                                    min="1"
                                    max="4"
                                    step="1"
                                    value={people}
                                    onChange={(e) => setPeople(parseInt(e.target.value))}
                                    className="w-full h-12 bg-black neo-border cursor-pointer appearance-none rounded-none accent-subby-yellow"
                                    style={{
                                        WebkitAppearance: "none",
                                    }}
                                />
                                <div className="flex justify-between mt-4 font-mono font-bold text-xl">
                                    <span>1</span>
                                    <span>4</span>
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <p className="font-bold uppercase text-xl mb-2">You pay only:</p>
                                <motion.div animate={controls} className="text-6xl md:text-8xl font-mono font-black">
                                    ₦{currentPrice.toLocaleString()}
                                </motion.div>
                                <p className="font-mono text-gray-500 mt-2">/ month instead of ₦{basePrice.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 48px;
          height: 48px;
          background: #FACC15;
          border: 3px solid black;
          cursor: pointer;
          border-radius: 0;
          box-shadow: 4px 4px 0px black;
        }
        input[type="range"]::-moz-range-thumb {
          width: 48px;
          height: 48px;
          background: #FACC15;
          border: 3px solid black;
          cursor: pointer;
          border-radius: 0;
          box-shadow: 4px 4px 0px black;
        }
      `}</style>
        </section>
    );
}
