"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function depositFunds(amount: number) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (amount <= 0) {
        return { error: "Invalid amount" };
    }

    try {
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

        // 2. Create transaction record
        const { error: txError } = await supabaseAdmin
            .from('transactions')
            .insert([{
                wallet_id: wallet.id,
                amount: amount,
                type: 'deposit',
                status: 'completed',
                reference: `MOCK_DEP_${Date.now()}`
            }]);

        if (txError) throw txError;

        // 3. Update wallet balance
        const newBalance = Number(wallet.balance) + amount;
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
