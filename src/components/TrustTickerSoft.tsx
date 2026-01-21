"use client";

import { motion } from "framer-motion";

const CHAT_BUBBLES = [
    { text: "Ola just saved ₦14k! 🎉", emoji: "🥳" },
    { text: "New squad for Spotify! 🎵", emoji: "🎶" },
    { text: "127 people rolling rn 💜", emoji: "✨" },
    { text: "Netflix crew is lit 📺", emoji: "🔥" },
];

export default function TrustTickerSoft() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 py-6">
            <div className="flex whitespace-nowrap animate-marquee gap-4">
                {[...CHAT_BUBBLES, ...CHAT_BUBBLES, ...CHAT_BUBBLES].map((item, i) => (
                    <div
                        key={i}
                        className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border-2 border-purple-100"
                    >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-sm font-bold text-purple-900">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
