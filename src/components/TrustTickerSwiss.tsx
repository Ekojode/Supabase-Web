"use client";

import { motion } from "framer-motion";

const TICKER_ITEMS = [
    "Ola saved ₦14,000 this month",
    "127 active groups running",
    "Netflix shared by 2,341 users",
    "Spotify split 4,892 times",
    "₦42M+ saved collectively",
];

export default function TrustTickerSwiss() {
    return (
        <div className="relative overflow-hidden border-y border-gray-100 bg-white py-3">
            <div className="flex whitespace-nowrap animate-marquee">
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} className="text-sm font-medium text-slate-500 mx-12 tracking-tight font-mono">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
