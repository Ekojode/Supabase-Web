"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, ChevronLeft, ChevronRight, Users, Shield, Zap } from "lucide-react";
import { NetflixLogo, SpotifyLogo, YoutubeLogo, AdobeLogo, CanvaLogo, NotionLogo } from "./BrandLogos";

const APPS = [
    {
        name: "Netflix",
        price: "₦1,100",
        originalPrice: "₦5,500",
        Logo: NetflixLogo,
        cat: "Entertainment",
        slots: "4-5 users",
        features: ["4K Ultra HD", "Multiple profiles", "Download content"],
        savings: "80%"
    },
    {
        name: "Spotify",
        price: "₦300",
        originalPrice: "₦1,800",
        Logo: SpotifyLogo,
        cat: "Entertainment",
        slots: "5-6 users",
        features: ["Ad-free music", "Offline listening", "High quality audio"],
        savings: "83%"
    },
    {
        name: "YouTube Premium",
        price: "₦500",
        originalPrice: "₦2,500",
        Logo: YoutubeLogo,
        cat: "Entertainment",
        slots: "4-5 users",
        features: ["No ads", "Background play", "YouTube Music"],
        savings: "80%"
    },
    {
        name: "Adobe Creative Cloud",
        price: "₦2,400",
        originalPrice: "₦12,000",
        Logo: AdobeLogo,
        cat: "Productivity",
        slots: "3-4 users",
        features: ["All Adobe apps", "100GB storage", "Adobe Fonts"],
        savings: "80%"
    },
    {
        name: "Canva Pro",
        price: "₦800",
        originalPrice: "₦4,000",
        Logo: CanvaLogo,
        cat: "Productivity",
        slots: "4-5 users",
        features: ["Premium templates", "Brand kit", "Background remover"],
        savings: "80%"
    },
    {
        name: "Notion",
        price: "₦400",
        originalPrice: "₦2,000",
        Logo: NotionLogo,
        cat: "Productivity",
        slots: "4-5 users",
        features: ["Unlimited blocks", "Team collaboration", "API access"],
        savings: "80%"
    },
];

export default function BrowseGroups() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reserveModal, setReserveModal] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState<string[]>([]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % APPS.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + APPS.length) % APPS.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleReserve = (appName: string) => {
        if (email) {
            setSubmitted([...submitted, appName]);
            setReserveModal(null);
            setEmail("");
        }
    };

    const currentApp = APPS[currentSlide];
    const isReserved = submitted.includes(currentApp.name);

    return (
        <section id="browse" className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-[#1A1A2E] mb-2">
                            Browse Groups
                        </h2>
                        <p className="text-[#3A5369]/70 text-lg">
                            Reserve your spot for when we launch.
                        </p>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative overflow-hidden">
                    {/* Navigation Arrows - Desktop */}
                    <button
                        onClick={prevSlide}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full items-center justify-center shadow-lg hover:bg-white hover:border-gray-300 transition-all"
                        aria-label="Previous app"
                    >
                        <ChevronLeft size={24} className="text-[#1A1A2E]" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full items-center justify-center shadow-lg hover:bg-white hover:border-gray-300 transition-all"
                        aria-label="Next app"
                    >
                        <ChevronRight size={24} className="text-[#1A1A2E]" />
                    </button>

                    {/* Main Slide */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                                {/* Left: App Info */}
                                <div>
                                    {/* Logo & Category */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center p-4">
                                            <currentApp.Logo className="w-full h-full" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#4CBBB9] bg-[#4CBBB9]/10 px-2 py-1 rounded">
                                                {currentApp.cat}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mt-2">
                                                {currentApp.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-4xl font-bold text-[#4CBBB9]">{currentApp.price}</span>
                                            <span className="text-base text-[#3A5369]/40 line-through">{currentApp.originalPrice}</span>
                                            <span className="text-sm font-medium text-[#3A5369]/60">/month</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#3A5369]/70">
                                            <Users size={16} />
                                            <span>Split between {currentApp.slots}</span>
                                            <span className="ml-auto font-bold text-[#4CBBB9]">Save {currentApp.savings}</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    {isReserved ? (
                                        <div className="w-full py-4 bg-[#4CBBB9]/10 rounded-xl text-center text-[#4CBBB9] font-bold flex items-center justify-center gap-2">
                                            <Check size={20} /> You're on the list!
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setReserveModal(currentApp.name)}
                                            className="group w-full py-4 rounded-xl bg-[#4CBBB9] text-white font-bold text-base hover:bg-[#3AA8A6] hover:shadow-lg hover:shadow-[#4CBBB9]/25 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Bell size={18} className="group-hover:animate-pulse" />
                                            Notify Me
                                        </button>
                                    )}
                                </div>

                                {/* Right: Features */}
                                <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#3A5369]/60 mb-4">
                                        What You Get
                                    </h4>
                                    <ul className="space-y-4">
                                        {currentApp.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#4CBBB9]/10 flex items-center justify-center">
                                                    <Check size={16} className="text-[#4CBBB9]" />
                                                </div>
                                                <span className="text-[#1A1A2E] font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t border-gray-200 mt-6 pt-6">
                                        <div className="flex items-center gap-3 text-sm text-[#3A5369]/70">
                                            <Shield size={16} className="text-[#4CBBB9]" />
                                            <span>Secure payment & instant access</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[#3A5369]/70 mt-2">
                                            <Zap size={16} className="text-[#4CBBB9]" />
                                            <span>Cancel anytime, no commitment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile Swipe Buttons */}
                    <div className="flex md:hidden justify-center gap-2 mt-4">
                        <button onClick={prevSlide} className="p-2 rounded-full bg-white border border-gray-200 active:bg-gray-100">
                            <ChevronLeft size={20} className="text-[#3A5369]" />
                        </button>
                        <button onClick={nextSlide} className="p-2 rounded-full bg-white border border-gray-200 active:bg-gray-100">
                            <ChevronRight size={20} className="text-[#3A5369]" />
                        </button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <span className="text-sm font-medium text-[#3A5369]/60">
                            {currentSlide + 1} / {APPS.length}
                        </span>
                        <div className="flex gap-2">
                            {APPS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? "bg-[#4CBBB9] w-8"
                                        : "bg-gray-300 hover:bg-gray-400 w-2.5"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservation Modal */}
            <AnimatePresence>
                {reserveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setReserveModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#1A1A2E]">
                                    Reserve {reserveModal}
                                </h3>
                                <button onClick={() => setReserveModal(null)}>
                                    <X size={20} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>

                            <p className="text-sm text-[#3A5369]/70 mb-4">
                                Enter your email to be notified when {reserveModal} groups become available.
                            </p>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] transition-colors"
                            />

                            <button
                                onClick={() => handleReserve(reserveModal!)}
                                disabled={!email}
                                className="w-full py-4 bg-[#1A1A2E] text-white rounded-xl font-bold hover:bg-[#2D2D44] disabled:opacity-50 transition-colors"
                            >
                                Notify Me
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
}
