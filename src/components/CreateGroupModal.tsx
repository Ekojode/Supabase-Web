"use client";

import { useState } from "react";
import { X, Users, Check, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { NetflixLogo, SpotifyLogo, YoutubeLogo, AdobeLogo, CanvaLogo, GenericSubIcon } from "./BrandLogos";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        subscription?: string;
        duration?: number;
    };
}

const SUBSCRIPTION_OPTIONS = [
    { name: "Netflix", Logo: NetflixLogo, price: "₦5,500" },
    { name: "Spotify", Logo: SpotifyLogo, price: "₦1,800" },
    { name: "YouTube Premium", Logo: YoutubeLogo, price: "₦2,500" },
    { name: "Adobe Creative Cloud", Logo: AdobeLogo, price: "₦12,000" },
    { name: "Canva Pro", Logo: CanvaLogo, price: "₦4,000" },
    { name: "Other", Logo: GenericSubIcon, price: "Custom" },
];

export default function CreateGroupModal({ isOpen, onClose, initialData }: CreateGroupModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize state with initialData if provided
    const [formData, setFormData] = useState({
        subscription: initialData?.subscription || "",
        customName: "",
        price: initialData?.subscription ? (SUBSCRIPTION_OPTIONS.find(s => s.name === initialData.subscription)?.price || "") : "",
        duration: initialData?.duration || 6,
        slots: 4,
        friends: [""],
    });

    const handleSubscriptionSelect = (sub: typeof SUBSCRIPTION_OPTIONS[0]) => {
        setFormData({
            ...formData,
            subscription: sub.name,
            price: sub.price === "Custom" ? "" : sub.price,
        });
    };

    const addFriend = () => {
        if (formData.friends.length < 5) {
            setFormData({ ...formData, friends: [...formData.friends, ""] });
        }
    };

    const removeFriend = (index: number) => {
        setFormData({
            ...formData,
            friends: formData.friends.filter((_, i) => i !== index),
        });
    };

    const updateFriend = (index: number, value: string) => {
        const newFriends = [...formData.friends];
        newFriends[index] = value;
        setFormData({ ...formData, friends: newFriends });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_name: formData.subscription,
                    custom_name: formData.subscription === "Other" ? formData.customName : null,
                    expected_price: formData.price,
                    duration: formData.duration,
                    slots: formData.slots,
                    friends_invited: formData.friends.filter(f => f.trim() !== '')
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            setStep(4);
        } catch (err: any) {
            setError(err.message || 'Failed to create group. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetAndClose = () => {
        const wasSuccess = step === 4;
        setStep(1);
        setFormData({
            subscription: "",
            customName: "",
            price: "",
            duration: 6,
            slots: 4,
            friends: [""],
        });
        onClose();
        if (wasSuccess) {
            router.refresh();
        }
    };

    // ⚠️ Critical: return null when closed so NO DOM nodes are mounted
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetAndClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden max-h-[85vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#4CBBB9]/10 flex items-center justify-center">
                            <Users size={20} className="text-[#4CBBB9]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1A1A2E]">Create a Group</h2>
                            <p className="text-sm text-[#3A5369]/60">Step {Math.min(step, 3)} of 3</p>
                        </div>
                    </div>
                    <button
                        onClick={resetAndClose}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X size={20} className="text-[#3A5369]" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4 flex-shrink-0">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#4CBBB9] rounded-full transition-all duration-500"
                            style={{ width: step === 4 ? "100%" : `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

                    {/* Step 1: Choose Subscription */}
                    {step === 1 && (
                        <div>
                            {error && (
                                <div className="p-3 mb-4 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                                What subscription do you want to share?
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {SUBSCRIPTION_OPTIONS.map((sub) => (
                                    <button
                                        key={sub.name}
                                        onClick={() => handleSubscriptionSelect(sub)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.subscription === sub.name
                                            ? "border-[#4CBBB9] bg-[#4CBBB9]/5"
                                            : "border-gray-100 hover:border-gray-200"
                                            }`}
                                    >
                                        <div className="w-10 h-10 mb-3">
                                            <sub.Logo className="w-full h-full" />
                                        </div>
                                        <span className="font-semibold text-[#1A1A2E] block">{sub.name}</span>
                                        <span className="text-sm text-[#3A5369]/60">{sub.price}</span>
                                    </button>
                                ))}
                            </div>

                            {formData.subscription === "Other" && (
                                <div className="space-y-4 mb-6">
                                    <input
                                        type="text"
                                        value={formData.customName}
                                        onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
                                        placeholder="Subscription name"
                                        className="subbay-input"
                                    />
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="Monthly price (e.g. ₦5,000)"
                                        className="subbay-input"
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.subscription}
                                className="subbay-btn w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Group Details */}
                    {step === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Group Terms &amp; Details</h3>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[#3A5369] font-medium">Commitment Duration</span>
                                    <span className="text-lg font-bold text-[#4CBBB9]">{formData.duration} Months</span>
                                </div>
                                <p className="text-xs text-[#3A5369]/60 mb-4">How long members will be locked in to share this subscription.</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[3, 6, 9, 12].map((dur) => (
                                        <button
                                            key={dur}
                                            onClick={() => setFormData({ ...formData, duration: dur })}
                                            className={`py-2 rounded-xl border-2 text-sm font-semibold transition-all ${formData.duration === dur
                                                ? "border-[#4CBBB9] bg-[#4CBBB9]/10 text-[#4CBBB9]"
                                                : "border-gray-100 text-[#3A5369] hover:border-gray-200"
                                                }`}
                                        >
                                            {dur} mo
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[#3A5369] font-medium">Number of slots</span>
                                    <span className="text-xl font-bold text-[#4CBBB9]">{formData.slots}</span>
                                </div>
                                <input
                                    type="range"
                                    min="2"
                                    max="6"
                                    value={formData.slots}
                                    onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) })}
                                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#4CBBB9]"
                                    style={{
                                        background: `linear-gradient(to right, #4CBBB9 0%, #4CBBB9 ${((formData.slots - 2) / 4) * 100}%, #E5E7EB ${((formData.slots - 2) / 4) * 100}%, #E5E7EB 100%)`
                                    }}
                                />
                                <div className="flex justify-between text-xs text-[#3A5369]/60 mt-2">
                                    {[2, 3, 4, 5, 6].map((n) => <span key={n}>{n}</span>)}
                                </div>
                            </div>

                            <div className="bg-[#4CBBB9]/5 rounded-2xl p-4 mb-6 border border-[#4CBBB9]/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[#3A5369] text-sm">Monthly price per slot</span>
                                    <span className="font-bold text-[#4CBBB9]">
                                        ₦{Math.round(parseInt(formData.price.replace(/[^\d]/g, "") || "0") / formData.slots).toLocaleString()}/mo
                                    </span>
                                </div>
                                <div className="w-full h-px bg-[#4CBBB9]/20 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#1A1A2E] font-medium">Upfront Commitment ({formData.duration} mo)</span>
                                    <span className="text-xl font-bold text-[#1A1A2E]">
                                        ₦{Math.round((parseInt(formData.price.replace(/[^\d]/g, "") || "0") / formData.slots) * formData.duration).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#3A5369]/60 mt-2">
                                    Members will fund their wallet with this amount to lock in for the duration.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="px-6 py-4 text-[#3A5369] font-medium flex items-center gap-2">
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button onClick={() => setStep(3)} className="subbay-btn flex-1 flex items-center justify-center gap-2">
                                    Continue <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Invite Friends */}
                    {step === 3 && (
                        <div>
                            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">Invite friends to your group</h3>
                            <p className="text-sm text-[#3A5369]/60 mb-6">Add people you want to share with (optional - you can skip)</p>

                            <div className="space-y-3 mb-6">
                                {formData.friends.map((friend, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={friend}
                                            onChange={(e) => updateFriend(index, e.target.value)}
                                            placeholder="Friend's email or phone"
                                            className="subbay-input flex-1"
                                        />
                                        {formData.friends.length > 1 && (
                                            <button
                                                onClick={() => removeFriend(index)}
                                                className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {formData.friends.length < formData.slots - 1 && (
                                <button
                                    onClick={addFriend}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[#3A5369]/60 font-medium hover:border-[#4CBBB9] hover:text-[#4CBBB9] transition-colors flex items-center justify-center gap-2 mb-6"
                                >
                                    <Plus size={18} /> Add another friend
                                </button>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setStep(2)} className="px-6 py-4 text-[#3A5369] font-medium flex items-center gap-2">
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="subbay-btn flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Processing..." : (formData.friends.filter(f => f).length > 0 ? "Create Group" : "Skip & Create")}
                                    {!isLoading && <Check size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-[#4CBBB9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-[#4CBBB9]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">Group Live! 🎉</h3>
                            <p className="text-[#3A5369]/70 mb-2">
                                Your {formData.subscription} group has been created successfully.
                            </p>
                            {formData.friends.filter(f => f).length > 0 && (
                                <p className="text-sm text-[#4CBBB9] font-semibold mb-4">
                                    {formData.friends.filter(f => f).length} friend(s) will be notified
                                </p>
                            )}
                            <button onClick={resetAndClose} className="subbay-btn">
                                Go to Dashboard
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
