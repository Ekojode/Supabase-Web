"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, Check, X, Plus } from "lucide-react";

export default function WaitlistTicket() {
    const [step, setStep] = useState<"form" | "referrals" | "success">("form");
    const [formData, setFormData] = useState({ email: "", phone: "" });
    const [referrals, setReferrals] = useState<string[]>([""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, phone: formData.phone }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            setStep("referrals");
        } catch (err: any) {
            setError(err.message || 'Failed to join waitlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReferralSubmit = async () => {
        setIsLoading(true);
        // We aren't actively doing a real backend submit for referrals yet, so we just simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
        setStep("success");
    };

    const addReferral = () => {
        if (referrals.length < 5) setReferrals([...referrals, ""]);
    };

    const removeReferral = (index: number) => {
        setReferrals(referrals.filter((_, i) => i !== index));
    };

    const updateReferral = (index: number, value: string) => {
        const newReferrals = [...referrals];
        newReferrals[index] = value;
        setReferrals(newReferrals);
    };

    // Sharp, clean input styles
    const inputClasses = "w-full bg-white border border-gray-200 text-[#1A1A2E] p-4 !pl-14 rounded-lg focus:outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] transition-all placeholder:text-gray-300 font-medium";

    if (step === "success") {
        return (
            <section id="waitlist" className="py-32 bg-gray-50">
                <div className="container mx-auto px-6 max-w-lg text-center">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-12 border border-gray-200 shadow-xl shadow-gray-100/50"
                    >
                        <div className="w-16 h-16 bg-[#4CBBB9] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-[#4CBBB9]/20">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-3xl font-bold text-[#1A1A2E] mb-3">You're In.</h3>
                        <p className="text-[#3A5369]/70 mb-0 leading-relaxed">
                            We've reserved your spot. Watch your inbox for your invite link.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (step === "referrals") {
        return (
            <section id="waitlist" className="py-32 bg-gray-50">
                <div className="container mx-auto px-6 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-10 border border-gray-200 shadow-xl shadow-gray-100/50"
                    >
                        <div className="mb-8 text-center">
                            <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">Invite Friends</h3>
                            <p className="text-[#3A5369]/60 text-sm">
                                Groups fill faster when you bring your own squad.
                            </p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {referrals.map((referral, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={referral}
                                        onChange={(e) => updateReferral(index, e.target.value)}
                                        placeholder="Friend's email"
                                        className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#1A1A2E]"
                                        autoFocus={index === referrals.length - 1}
                                    />
                                    {referrals.length > 1 && (
                                        <button
                                            onClick={() => removeReferral(index)}
                                            className="w-12 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {referrals.length < 5 && (
                                <button
                                    onClick={addReferral}
                                    className="text-sm font-semibold text-[#4CBBB9] hover:text-[#3AA8A6] flex items-center gap-1 mt-2"
                                >
                                    <Plus size={16} /> Add another friend
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleReferralSubmit}
                            disabled={isLoading}
                            className="w-full bg-[#1A1A2E] text-white font-bold py-4 rounded-xl hover:bg-[#2D2D44] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : (referrals.filter(r => r).length > 0 ? "Send Invites" : "Skip")}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="waitlist" className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6 max-w-5xl">

                <div className="bg-white rounded-[2rem] p-8 md:p-16 border border-gray-200 shadow-xl shadow-gray-100/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

                        {/* Copy Side */}
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-[#4CBBB9]/10 text-[#4CBBB9] text-xs font-bold tracking-widest uppercase mb-6">
                                Limited Access
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6 leading-[1.1]">
                                Join the <br />
                                <span className="text-gray-300">Waitlist.</span>
                            </h2>
                            <p className="text-lg text-[#3A5369]/70 mb-8 leading-relaxed">
                                We're opening up spots gradually to ensure the best experience. Secure your place in line now.
                            </p>

                            <div className="flex items-center gap-4 py-4 border-t border-gray-100">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-[#1A1A2E]">
                                    +12k people waiting
                                </span>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#3A5369]/60 mb-2 ml-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#3A5369]/60 mb-2 ml-1">
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="080 1234 5678"
                                            className={inputClasses}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#1A1A2E] text-white font-bold py-4 rounded-xl hover:bg-[#2D2D44] hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Processing..." : "Get Early Access"}
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
