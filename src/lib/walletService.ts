import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Calculates the exact commitment required for a user to join a group.
 * @param pricePerSlot Monthly cost of one slot in the group
 * @param durationMonths The lock-in duration set by the provider
 * @returns Total upfront commitment required
 */
export function calculateCommitment(pricePerSlot: number, durationMonths: number): number {
    return pricePerSlot * durationMonths;
}

/**
 * Checks if a user has sufficient balance in their wallet to join a group.
 * If so, deducts the balance, creates a transaction record, and adds them to the group.
 */
export async function joinGroupWithWallet(userId: string, groupId: string, pricePerSlot: number, durationMonths: number) {
    const commitmentAmount = calculateCommitment(pricePerSlot, durationMonths);

    // 1. Fetch User Wallet
    const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (walletError || !wallet) throw new Error("Wallet not found.");

    if (wallet.balance < commitmentAmount) {
        throw new Error(`Insufficient funds. You need ₦${commitmentAmount} to commit for ${durationMonths} months.`);
    }

    // 2. Perform Transaction (Deduct Balance) - Should ideally be done in a DB Function/RPC for atomicity
    const newBalance = wallet.balance - commitmentAmount;

    await supabase.from('wallets').update({ balance: newBalance }).eq('id', wallet.id);

    // 3. Record Transaction
    await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: -commitmentAmount,
        type: 'commitment',
        reference: `join_group_${groupId}`,
        status: 'completed'
    });

    // 4. Add User to Group
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    await supabase.from('group_members').insert({
        group_id: groupId,
        user_id: userId,
        status: 'active',
        joined_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
    });

    return { success: true, newBalance };
}

/**
 * RE-AGGREGATION LOGIC
 * Triggered when a group adds a NEW subscription to their existing pool, increasing the monthly cost.
 * Calculates how the remaining locked funds translate into the new, shorter duration.
 * 
 * @param currentMonthlyCost The old total cost per slot (e.g., ₦1,500/mo)
 * @param newMonthlyCost The new total cost per slot including the new sub (e.g., ₦2,000/mo)
 * @param remainingDays How many days the user had left on their original commitment
 * @returns The new remaining days adjusted for the higher burn rate
 */
export function calculateReAggregation(currentMonthlyCost: number, newMonthlyCost: number, remainingDays: number): number {

    // 1. Calculate the user's remaining locked value (cash equivalent)
    const dailyBurnRateOld = currentMonthlyCost / 30; // approx
    const remainingCashValue = remainingDays * dailyBurnRateOld;

    // 2. Calculate the new burn rate
    const dailyBurnRateNew = newMonthlyCost / 30;

    // 3. Determine how many days the remaining cash can cover at the new rate
    const newRemainingDays = remainingCashValue / dailyBurnRateNew;

    return Math.floor(newRemainingDays);
}

/**
 * Applies the re-aggregation to all members of a group when a new subscription is approved.
 */
export async function applyReAggregationToGroup(groupId: string, newTotalMonthlyCostPerSlot: number) {
    // 1. Fetch group details to get the OLD monthly cost
    const { data: group } = await supabase.from('groups').select('*').eq('id', groupId).single();
    if (!group) throw new Error("Group not found");

    const oldMonthlyCostPerSlot = group.price_per_member / group.duration_months;

    // 2. Fetch all active group members
    const { data: members } = await supabase.from('group_members').select('*').eq('group_id', groupId).eq('status', 'active');

    if (!members) return;

    for (const member of members) {
        // Calculate remaining days based on expires_at relative to now
        const expiresAt = new Date(member.expires_at);
        const now = new Date();
        const diffTime = Math.abs(expiresAt.getTime() - now.getTime());
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculate new remaining days
        const newRemainingDays = calculateReAggregation(oldMonthlyCostPerSlot, newTotalMonthlyCostPerSlot, remainingDays);

        // Calculate new expiration date
        const newExpiresAt = new Date(now);
        newExpiresAt.setDate(now.getDate() + newRemainingDays);

        // Update database
        await supabase.from('group_members')
            .update({ expires_at: newExpiresAt.toISOString() })
            .eq('id', member.id);

        // Note: You would typically also log a 're_aggregation_adjustment' transaction note linking back to the wallet showing the shift in allocation.
    }

    // 3. Update the group's recorded total cost so future members pay the new price
    await supabase.from('groups')
        .update({ price_per_member: newTotalMonthlyCostPerSlot * group.duration_months }) // Updates the total upfront commit cost
        .eq('id', groupId);
}
