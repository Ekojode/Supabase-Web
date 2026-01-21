"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="bg-white neo-border px-6 py-4 flex items-center justify-between neo-shadow bg-[#F4F3EF]">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-black tracking-tighter">SUBBY</span>
                    <div className="w-3 h-3 bg-black rounded-full" />
                </div>

                <div className="hidden md:flex items-center gap-8 font-bold uppercase">
                    <a href="#" className="hover:underline underline-offset-4 decoration-2">Pricing</a>
                    <a href="#" className="hover:underline underline-offset-4 decoration-2">How it works</a>
                    <a href="#" className="hover:underline underline-offset-4 decoration-2">FAQs</a>
                </div>

                <motion.button
                    whileHover={{ x: 1, y: 1, boxShadow: "2px 2px 0px #000" }}
                    whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px #000" }}
                    className="bg-subby-yellow neo-border px-6 py-2 font-black uppercase neo-shadow transition-colors"
                >
                    Join Waitlist
                </motion.button>
            </div>
        </nav>
    );
}
