"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setScrolled(latest > 20);
        });
    }, [scrollY]);

    // Nav Link Component with Hover Effect
    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} className="group relative text-sm font-medium text-[#3A5369] hover:text-[#1A1A2E] transition-colors py-1">
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1A1A2E] transition-all duration-300 group-hover:w-full" />
        </Link>
    );

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md py-4 shadow-sm"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#1A1A2E] flex items-center justify-center text-white font-bold text-lg">
                            S
                        </div>
                        <span className="text-xl font-bold text-[#1A1A2E]">
                            Subb Bay
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="#how-it-works">How it works</NavLink>
                        <NavLink href="#faq">FAQs</NavLink>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <a
                            href="#waitlist"
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${scrolled
                                ? "bg-[#1A1A2E] text-white hover:bg-[#2D2D44]"
                                : "bg-white text-[#1A1A2E] border border-gray-200 hover:border-gray-300 shadow-sm"
                                }`}
                        >
                            Get Early Access
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-[#1A1A2E]"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mt-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col gap-2"
                    >
                        <Link href="#how-it-works" className="text-[#3A5369] font-medium py-3 px-4 rounded-xl hover:bg-gray-50">
                            How it works
                        </Link>
                        <Link href="#browse" className="text-[#3A5369] font-medium py-3 px-4 rounded-xl hover:bg-gray-50">
                            Browse Groups
                        </Link>
                        <Link href="#faq" className="text-[#3A5369] font-medium py-3 px-4 rounded-xl hover:bg-gray-50">
                            FAQs
                        </Link>
                        <a href="#waitlist" className="bg-[#1A1A2E] text-white font-semibold py-3 rounded-xl text-center mt-2">
                            Get Early Access
                        </a>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
