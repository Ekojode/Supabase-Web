"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function verifyAndDepositFunds(reference: string, expectedNetAmount: number) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    if (expectedNetAmount <= 0) {
        return { error: "Invalid amount" };
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
        return { error: "Payment gateway is not configured." };
    }

    try {
        // 1. Verify with Paystack
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
            },
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.status || verifyData.data.status !== "success") {
            return { error: "Payment verification failed." };
        }

        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Check if this reference has already been used (idempotency)
        const { data: existingTx } = await supabaseAdmin
            .from('transactions')
            .select('id')
            .eq('reference', reference)
            .single();

        if (existingTx) {
            return { error: "Transaction has already been processed." };
        }

        // 3. Ensure Wallet exists
        let { data: wallet } = await supabaseAdmin
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!wallet) {
            const { data: newWallet, error: createError } = await supabaseAdmin
                .from('wallets')
                .insert([{ user_id: user.id, balance: 0 }])
                .select()
                .single();

            if (createError) throw createError;
            wallet = newWallet;
        }

        if (!wallet) {
            throw new Error("Could not initialize wallet");
        }

        // 4. Create transaction record (Log exactly what they get out of it, which is the net amount)
        const { error: txError } = await supabaseAdmin
            .from('transactions')
            .insert([{
                wallet_id: wallet.id,
                amount: expectedNetAmount,
                type: 'deposit',
                status: 'completed',
                reference: reference
            }]);

        if (txError) throw txError;

        // 5. Update wallet balance
        const newBalance = Number(wallet.balance) + expectedNetAmount;
        const { error: updateError } = await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq('id', wallet.id);

        if (updateError) throw updateError;

        revalidatePath("/dashboard/wallet");
        return { success: true, newBalance };

    } catch (e: any) {
        console.error("Deposit error:", e);
        return { error: e.message || "Failed to process deposit" };
    }
}
