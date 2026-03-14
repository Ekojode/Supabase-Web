"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processGroupPayment } from "./actions";

export default function PaymentProcessor({ 
    groupId, 
    membershipId,
    amount, 
    duration 
}: { 
    groupId: string, 
    membershipId: string,
    amount: number, 
    duration: number 
}) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const totalAmount = amount * duration;

    const handlePayment = async () => {
        setIsProcessing(true);
        const result = await processGroupPayment(groupId, membershipId, amount, duration);
        
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Payment successful! The vault is now unlocked.");
            router.refresh();
        }
        setIsProcessing(false);
    };

    return (
        <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] disabled:opacity-70 text-[#1A1A2E] font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
            {isProcessing ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()} & Unlock`}
        </button>
    );
}
