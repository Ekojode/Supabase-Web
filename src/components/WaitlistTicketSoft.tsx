"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function WaitlistTicketSoft() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        // Confetti effect
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = Math.random() * 100 + "%";
            confetti.style.animationDelay = Math.random() * 0.3 + "s";
            confetti.style.backgroundColor = ["#C084FC", "#86EFAC", "#FDA4AF"][Math.floor(Math.random() * 3)];
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }
    };

    if (submitted) {
        return (
            <section className="py-24 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 text-white overflow-hidden">
                <div className="container mx-auto px-6 max-w-md">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-[3rem] p-12 text-center shadow-2xl text-purple-900"
                    >
                        <div className="text-7xl mb-4">🎉</div>
                        <h3 className="text-4xl font-black mb-4">You're in the squad!</h3>
                        <p className="text-lg font-bold">We'll hit you up soon! 💜</p>
                    </motion.div>
                </div>

                <style jsx>{`
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            top: -10px;
            animation: fall 2s linear forwards;
            z-index: 9999;
          }
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
            </section>
        );
    }

    return (
        <section className="py-24 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 text-white">
            <div className="container mx-auto px-6 max-w-md">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[3rem] p-12 text-center shadow-2xl"
                >
                    <div className="text-7xl mb-6">🎟️</div>
                    <h2 className="text-4xl font-black text-purple-900 mb-4">Get Early Access</h2>
                    <p className="text-purple-700 font-bold mb-8">Join the party before everyone else!</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-6 py-4 rounded-full bg-purple-50 text-purple-900 placeholder-purple-400 font-bold focus:outline-none focus:ring-4 focus:ring-purple-300"
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-black text-lg shadow-lg"
                        >
                            Let's Go! 🚀
                        </motion.button>
                    </form>

                    <p className="text-xs text-purple-600 mt-6 font-bold">Made with 💜 in Lagos</p>
                </motion.div>
            </div>
        </section>
    );
}
