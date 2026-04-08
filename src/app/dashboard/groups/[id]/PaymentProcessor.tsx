"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processGroupPayment } from "./actions";
import { PaystackButton } from "react-paystack";
import { calculateGrossAmount } from "@/utils/paystack";
import { verifyAndDepositFunds } from "@/app/dashboard/wallet/actions";
import { Shield, Wallet, CreditCard, Lock, X, CheckCircle2 } from "lucide-react";

type ModalStep = "confirm" | "topup" | "processing" | "done";

function PaymentModal({
    isOpen,
    onClose,
    amount,
    duration,
    email,
    walletBalance,
    groupId,
    membershipId,
    subscriptionName,
}: {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    duration: number;
    email: string;
    walletBalance: number;
    groupId: string;
    membershipId: string;
    subscriptionName?: string;
}) {
    const router = useRouter();
    const [step, setStep] = useState<ModalStep>("confirm");

    const totalAmount = amount * duration;
    const shortfall = Math.max(0, totalAmount - walletBalance);
    const fromWallet = Math.min(walletBalance, totalAmount);
    const hasEnough = shortfall === 0;
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
    const grossTopUp = calculateGrossAmount(shortfall);

    const commitEscrow = async () => {
        setStep("processing");
        const result = await processGroupPayment(groupId, membershipId, amount, duration);
        if (result.error) {
            toast.error(result.error);
            setStep("confirm");
        } else {
            setStep("done");
        }
    };

    const paystackConfig = {
        reference: new Date().getTime().toString() + "_topup",
        email,
        amount: grossTopUp * 100,
        publicKey,
        text: `Pay ₦${grossTopUp.toLocaleString()} via Card`,
        onSuccess: async (reference: any) => {
            setStep("processing");
            const res = await verifyAndDepositFunds(reference.reference, shortfall);
            if (res.error) {
                toast.error("Top-up failed: " + res.error);
                setStep("confirm");
                return;
            }
            await commitEscrow();
        },
        onClose: () => setStep("confirm"),
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#1A1A2E] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-[#4CBBB9]" />
                        <span className="text-white font-bold">
                            {step === "done" ? "Access Granted" : "Commit to Escrow"}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* ── Done ── */}
                {step === "done" && (
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} className="text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Vault Unlocked! 🎉</h3>
                        <p className="text-white/60 text-sm mb-6">
                            Your escrow payment was successful. The {subscriptionName} credentials are now visible.
                        </p>
                        <button
                            onClick={() => { onClose(); router.refresh(); }}
                            className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] text-[#1A1A2E] font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                            View Credentials
                        </button>
                    </div>
                )}

                {/* ── Processing ── */}
                {step === "processing" && (
                    <div className="p-8 text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#4CBBB9]/20 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-[#4CBBB9] border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-white font-bold">Processing...</p>
                        <p className="text-white/50 text-xs mt-1">Please wait, do not close this page.</p>
                    </div>
                )}

                {/* ── Top-Up Step ── */}
                {step === "topup" && (
                    <div className="p-5 space-y-4">
                        <p className="text-white/60 text-sm">
                            Your wallet is short by <span className="text-orange-400 font-bold">₦{shortfall.toLocaleString()}</span>. Fund the shortfall via card to complete the escrow.
                        </p>

                        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                            <div className="flex justify-between text-white/60">
                                <span>Shortfall</span>
                                <span className="text-white">₦{shortfall.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-white/40 text-xs">
                                <span>Paystack processing fee</span>
                                <span>₦{(grossTopUp - shortfall).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                                <span>Card charge</span>
                                <span className="text-[#4CBBB9]">₦{grossTopUp.toLocaleString()}</span>
                            </div>
                        </div>

                        {publicKey ? (
                            <PaystackButton
                                {...paystackConfig}
                                className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] text-[#1A1A2E] font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            />
                        ) : (
                            <p className="text-red-400 text-xs text-center">Payment not configured.</p>
                        )}

                        <button
                            onClick={() => setStep("confirm")}
                            className="w-full text-white/40 hover:text-white/60 text-xs py-1 transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                )}

                {/* ── Confirm Step ── */}
                {step === "confirm" && (
                    <div className="p-5 space-y-4">
                        {/* Breakdown */}
                        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                            <div className="flex justify-between text-white/60">
                                <span>₦{amount.toLocaleString()} × {duration} months</span>
                                <span className="text-white font-semibold">₦{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                                <span>Total (Escrow)</span>
                                <span className="text-[#4CBBB9] text-base">₦{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Wallet */}
                        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-white/60">
                                <Wallet size={14} className="text-[#4CBBB9]" />
                                <span>Wallet balance</span>
                                <span className="ml-auto text-white font-semibold">₦{walletBalance.toLocaleString()}</span>
                            </div>
                            {hasEnough ? (
                                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                                    <CheckCircle2 size={12} />
                                    Wallet fully covers this payment
                                </div>
                            ) : (
                                <div className="flex justify-between text-xs text-orange-400 font-semibold">
                                    <span>Shortfall (need to top up)</span>
                                    <span>₦{shortfall.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-[10px] text-white/30 text-center leading-relaxed px-1">
                            <Lock size={10} className="inline mr-1" />
                            Held in escrow. Access is immediate. The provider is paid monthly from this fund.
                        </p>

                        {hasEnough ? (
                            <button
                                onClick={commitEscrow}
                                className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] text-[#1A1A2E] font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Shield size={16} />
                                Confirm &amp; Unlock
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep("topup")}
                                className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] text-[#1A1A2E] font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <CreditCard size={16} />
                                Top Up &amp; Unlock
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// The actual component rendered in the vault
// ─────────────────────────────────────────────
export default function PaymentProcessor({
    groupId,
    membershipId,
    amount,
    duration,
    email,
    walletBalance,
    subscriptionName,
}: {
    groupId: string;
    membershipId: string;
    amount: number;
    duration: number;
    email: string;
    walletBalance: number;
    subscriptionName?: string;
}) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] text-[#1A1A2E] font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
                <Lock size={16} />
                Join &amp; Unlock Vault
            </button>

            <PaymentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                groupId={groupId}
                membershipId={membershipId}
                amount={amount}
                duration={duration}
                email={email}
                walletBalance={walletBalance}
                subscriptionName={subscriptionName}
            />
        </>
    );
}
