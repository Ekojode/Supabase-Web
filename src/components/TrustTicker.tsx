"use client";

import { motion } from "framer-motion";

const TICKER_ITEMS = [
    "Ola saved ₦14,000 this month 🎉",
    "127 active groups running",
    "Netflix shared by 2,341 users",
    "Spotify split 4,892 times",
    "₦42M+ saved collectively",
    "Join 12,000+ smart subscribers",
];

export default function TrustTicker() {
    return (
        <div className="relative overflow-hidden bg-[#4CBBB9] py-4">
            <div className="flex whitespace-nowrap animate-marquee">
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span
                        key={i}
                        className="text-sm font-semibold text-white mx-12 tracking-wide"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
