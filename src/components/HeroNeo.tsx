"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Tv, Music, Zap, ArrowUpRight } from "lucide-react";
import { MouseEvent, useState } from "react";

const APPS = ["NETFLIX", "SPOTIFY", "ADOBE", "STARLINK", "CANVA", "PRIME", "YOUTUBE"];

const CHOP_CARDS = [
    { name: "Netflix", icon: Tv, price: "₦1,100", color: "#FACC15", rotate: -8, z: 1 },
    { name: "Spotify", icon: Music, price: "₦300", color: "#10B981", rotate: -2, z: 2 },
    { name: "YouTube", icon: Zap, price: "₦400", color: "#ffffff", rotate: 6, z: 3 },
];

export default function Hero() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Smooth out the mouse values
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        // Calculate normalized position (-1 to 1)
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        x.set(xPos);
        y.set(yPos);
    }

    return (
        <section
            onMouseMove={handleMouseMove}
            className="pt-32 pb-20 overflow-hidden bg-[#F4F3EF] relative"
        >
            {/* Infinite Marquee background */}
            <div className="relative rotate-[-2deg] scale-105 border-y-3 border-black bg-white mb-20 overflow-hidden py-4 z-10">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...APPS, ...APPS, ...APPS].map((app, i) => (
                        <span key={i} className="text-4xl font-black mx-8 flex items-center">
                            {app} <span className="ml-16"> • </span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center relative z-20">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ease: "circOut", duration: 0.8 }}
                    className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-6"
                >
                    SUBSCRIPTIONS <br /> ARE EXPENSIVE.
                </motion.h1>

                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, ease: "circOut", duration: 0.6 }}
                    className="text-2xl md:text-4xl font-bold uppercase mb-12 bg-subby-yellow neo-border px-6 py-2 neo-shadow rotate-1"
                >
                    So we chop the bill.
                </motion.p>

                {/* Functional Chop Cards - Stabilized Parallax Physics */}
                <div className="relative h-[450px] w-full max-w-lg mt-10 perspective-1000">
                    {CHOP_CARDS.map((card, i) => {
                        const isHovered = hoveredIndex === i;
                        const isAnyHovered = hoveredIndex !== null;

                        // Parallax transforms - Only active when NOT hovered
                        // If any card is hovered, we dampen the background ones significantly or freeze them
                        const rotateX = useTransform(mouseY, [-1, 1], [isHovered ? 0 : 5 + (i * 2), isHovered ? 0 : -5 - (i * 2)]);
                        const rotateY = useTransform(mouseX, [-1, 1], [isHovered ? 0 : -5 - (i * 2), isHovered ? 0 : 5 + (i * 2)]);
                        const moveX = useTransform(mouseX, [-1, 1], [isHovered ? 0 : -20 * (i + 1), isHovered ? 0 : 20 * (i + 1)]);
                        const moveY = useTransform(mouseY, [-1, 1], [isHovered ? 0 : -10 * (i + 1), isHovered ? 0 : 10 * (i + 1)]);

                        return (
                            <motion.div
                                key={card.name}
                                initial={{ y: 200, opacity: 0, rotate: card.rotate }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    scale: isHovered ? 1.1 : 1, // Controlled scale state
                                    zIndex: isHovered ? 100 : card.z, // Force top z-index on hover
                                    rotate: isHovered ? 0 : card.rotate // straighten on hover
                                }}
                                style={{
                                    x: isHovered ? 0 : moveX,
                                    y: isHovered ? 0 : moveY,
                                    rotateX: isHovered ? 0 : rotateX,
                                    rotateY: isHovered ? 0 : rotateY,
                                    backgroundColor: card.color,
                                }}
                                onHoverStart={() => setHoveredIndex(i)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                transition={{
                                    duration: 0.4,
                                    ease: "circOut", // Fast, smooth snapping
                                }}
                                className={`absolute inset-0 m-auto w-full h-[280px] neo-border neo-shadow p-8 flex flex-col justify-between cursor-pointer group origin-center preserve-3d ${isAnyHovered && !isHovered ? "pointer-events-none blur-[1px] transition-all" : ""}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center neo-border transition-transform transform group-hover:rotate-12">
                                        <card.icon size={32} />
                                    </div>
                                    <div className="bg-black text-white px-3 py-1 font-mono text-xs uppercase font-black">
                                        Batch #2026
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-4xl font-black uppercase text-left mb-1">{card.name}</h3>
                                    <p className="font-mono text-xs uppercase text-left opacity-60 font-bold">Split Membership Card</p>
                                </div>

                                <div className="flex justify-between items-end border-t-2 border-black pt-4">
                                    <div className="text-left">
                                        <p className="font-mono text-[10px] uppercase font-black opacity-50">Your Cut</p>
                                        <p className="text-4xl font-black font-mono leading-none">{card.price}</p>
                                    </div>
                                    <motion.div
                                        whileHover={{ rotate: 45 }}
                                        className="w-12 h-12 bg-black text-white flex items-center justify-center neo-border"
                                    >
                                        <ArrowUpRight size={24} />
                                    </motion.div>
                                </div>

                                {/* Revealable badge on hover */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: isHovered ? 1 : 0,
                                        scale: isHovered ? 1 : 0.8
                                    }}
                                    className="absolute -top-6 -right-6 bg-subby-emerald text-black neo-border neo-shadow px-4 py-2 font-black uppercase rotate-12 z-50 pointer-events-none whitespace-nowrap"
                                >
                                    Save 75%
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
          width: fit-content;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
        </section>
    );
}
