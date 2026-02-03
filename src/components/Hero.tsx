"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import { NetflixLogo, SpotifyLogo, CanvaLogo, AdobeLogo } from "./BrandLogos";

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const brandIcons = [
        { name: "Netflix", Logo: NetflixLogo },
        { name: "Spotify", Logo: SpotifyLogo },
        { name: "Canva", Logo: CanvaLogo },
        { name: "Adobe", Logo: AdobeLogo },
    ];

    return (
        <section className="min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-[#4CBBB9]/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 40, 0], scale: [1, 0.9, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 right-[-10%] w-[600px] h-[600px] bg-[#3A5369]/10 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#1A1A2E] mb-6 leading-[1.05] tracking-tight"
                >
                    Split subscriptions. <br />
                    <span className="text-[#4CBBB9]">Save together.</span>
                </motion.h1>

                {/* Subheadline - REDUCED SIZE */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-base md:text-lg text-[#3A5369]/70 font-medium mb-12 max-w-xl mx-auto leading-relaxed"
                >
                    Subb Bay helps you share premium subscriptions with friends and family.
                    Create groups, split costs, and get access instantly.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 items-center"
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="subbay-btn text-base px-8 py-3.5"
                    >
                        Create a Group
                    </button>
                    <a href="#waitlist" className="subbay-btn-outline text-base px-8 py-3.5">
                        Join Waitlist
                    </a>
                </motion.div>


                {/* Floating Brand Logos */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-20 flex justify-center gap-6"
                >
                    {brandIcons.map((brand, i) => (
                        <motion.div
                            key={brand.name}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white subbay-card flex items-center justify-center p-4"
                        >
                            <brand.Logo className="w-full h-full" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Create Group Modal */}
            <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
