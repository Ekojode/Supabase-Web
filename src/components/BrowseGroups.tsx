"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { NetflixLogo, SpotifyLogo, YoutubeLogo, AdobeLogo, CanvaLogo, NotionLogo } from "./BrandLogos";

const APPS = [
    { name: "Netflix", price: "₦1,100", Logo: NetflixLogo, cat: "Entertainment" },
    { name: "Spotify", price: "₦300", Logo: SpotifyLogo, cat: "Entertainment" },
    { name: "YouTube", price: "₦500", Logo: YoutubeLogo, cat: "Entertainment" },
    { name: "Adobe CC", price: "₦2,400", Logo: AdobeLogo, cat: "Productivity" },
    { name: "Canva Pro", price: "₦800", Logo: CanvaLogo, cat: "Productivity" },
    { name: "Notion", price: "₦400", Logo: NotionLogo, cat: "Productivity" },
];

export default function BrowseGroups() {
    const [reserveModal, setReserveModal] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState<string[]>([]);

    const handleReserve = (appName: string) => {
        if (email) {
            setSubmitted([...submitted, appName]);
            setReserveModal(null);
            setEmail("");
        }
    };

    return (
        <section id="browse" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div>
                        <h2 className="text-4xl font-bold text-[#1A1A2E] mb-2">
                            Browse Groups
                        </h2>
                        <p className="text-[#3A5369]/70 text-lg">
                            Reserve your spot for when we launch.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {APPS.map((app, i) => {
                        const isReserved = submitted.includes(app.name);

                        return (
                            <motion.div
                                key={app.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group flex flex-col justify-between h-full"
                            >
                                <div>
                                    {/* Top Row */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center p-3 group-hover:bg-[#4CBBB9]/10 transition-colors">
                                            <app.Logo className="w-full h-full" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-1 rounded">
                                            {app.cat}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{app.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-2xl font-bold text-[#4CBBB9] tracking-tight">{app.price}</span>
                                        <span className="text-xs text-[#3A5369]/60 font-medium">/month</span>
                                    </div>
                                </div>

                                {/* Action */}
                                {isReserved ? (
                                    <div className="w-full py-3 bg-[#4CBBB9]/10 rounded-lg text-sm text-center text-[#4CBBB9] font-bold flex items-center justify-center gap-2">
                                        <Check size={16} /> Reserved
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setReserveModal(app.name)}
                                        className="w-full py-3 rounded-lg border border-gray-200 text-[#1A1A2E] font-semibold text-sm hover:bg-[#1A1A2E] hover:text-white hover:border-[#1A1A2E] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Bell size={16} />
                                        Notify Me
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Modal - Kept Simple */}
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

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-[#1A1A2E] transition-colors"
                            />

                            <button
                                onClick={() => handleReserve(reserveModal!)}
                                disabled={!email}
                                className="w-full py-3 bg-[#1A1A2E] text-white rounded-lg font-semibold hover:bg-[#2D2D44] disabled:opacity-50 transition-colors"
                            >
                                Notify Me
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
