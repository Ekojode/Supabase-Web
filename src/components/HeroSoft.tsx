"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function HeroSoft() {
    return (
        <section className="min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20 relative overflow-hidden">

            {/* Background Shapes */}
            <motion.div
                animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-[-5%] w-96 h-96 bg-[#FFE4E6] rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, 40, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 right-[-5%] w-[500px] h-[500px] bg-[#E0E7FF] rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"
            />

            <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">

                {/* Clay Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[2rem] bg-[#F0F4F8] neo-shadow mb-8 text-[#5B4B8A]"
                >
                    <Sparkles size={16} className="text-pink-400" />
                    <span className="text-sm font-extrabold tracking-wide uppercase">Join 12,000+ friends</span>
                </motion.div>

                <h1 className="text-7xl md:text-9xl font-black text-[#5B4B8A] mb-8 leading-[0.9] tracking-tight drop-shadow-sm">
                    Don't pay <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">alone.</span>
                </h1>

                <p className="text-2xl md:text-3xl text-[#5B4B8A]/70 font-bold mb-12 max-w-2xl mx-auto leading-tight">
                    Sharing subscriptions is smarter. Find your group today and save gently.
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#F0F4F8] text-[#5B4B8A] px-10 py-5 rounded-[2rem] font-extrabold text-xl neo-shadow transition-all border-4 border-white"
                    >
                        Get Started 🚀
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 rounded-[2rem] font-bold text-xl text-[#5B4B8A]/60 hover:text-[#5B4B8A] transition-colors"
                    >
                        Watch Video
                    </motion.button>
                </div>

                {/* Floating Clay Avatars */}
                <div className="mt-24 flex justify-center gap-12">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-32 h-32 rounded-[3rem] bg-[#F0F4F8] neo-shadow border-4 border-white flex items-center justify-center text-5xl relative group cursor-pointer"
                        >
                            <span className="relative z-10 transition-transform group-hover:scale-125 duration-300">
                                {i === 1 ? "📺" : i === 2 ? "🎵" : "🎨"}
                            </span>

                            {/* Inner highlight for extra gloss */}
                            <div className="absolute top-4 left-4 w-6 h-6 bg-white rounded-full opacity-40 blur-[2px]" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
