"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function processGroupPayment(groupId: string, membershipId: string, amountPerMonth: number, durationMonths: number) {
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const totalAmount = Number(amountPerMonth) * Number(durationMonths);

    try {
        // 1. Get wallet
        const { data: wallet } = await supabaseAdmin
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!wallet || Number(wallet.balance) < totalAmount) {
            return { error: `Insufficient funds. Your wallet balance is ₦${Number(wallet?.balance || 0).toLocaleString()}, but you need ₦${totalAmount.toLocaleString()} to commit for ${durationMonths} months.` };
        }

        // 2. Deduct from wallet
        const newBalance = Number(wallet.balance) - totalAmount;
        const { error: updateError } = await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq('id', wallet.id);

        if (updateError) throw updateError;

        // 3. Create transaction record
        const { error: txError } = await supabaseAdmin
            .from('transactions')
            .insert([{
                wallet_id: wallet.id,
                amount: totalAmount,
                type: 'commitment',
                status: 'completed',
                reference: `GRP_${groupId}`
            }]);

        if (txError) throw txError;

        // 4. Update or Insert membership status
        const expiresAt = new Date(new Date().setMonth(new Date().getMonth() + durationMonths)).toISOString();
        
        if (membershipId && membershipId.trim() !== '') {
            // Existing member (e.g., from invite)
            const { error: memError } = await supabaseAdmin
                .from('group_members')
                .update({ 
                    status: 'active',
                    expires_at: expiresAt
                })
                .eq('id', membershipId);
                
            if (memError) throw memError;
        } else {
            // New member joining directly from browse
            const { error: memError } = await supabaseAdmin
                .from('group_members')
                .insert([{
                    group_id: groupId,
                    user_id: user.id,
                    status: 'active',
                    expires_at: expiresAt
                }]);
                
            if (memError) throw memError;
        }

        revalidatePath(`/dashboard/groups/${groupId}`);
        revalidatePath("/dashboard/wallet");
        revalidatePath("/dashboard");
        
        return { success: true };

    } catch (e: any) {
        console.error("Payment error:", e);
        return { error: e.message || "Failed to process payment" };
    }
}
