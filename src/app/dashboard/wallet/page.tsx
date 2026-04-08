import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WalletView from "./WalletView";

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Wallet
    let { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

    // Auto-create wallet if it doesn't exist
    if (!wallet) {
        const { data: newWallet } = await supabase
            .from('wallets')
            .insert([{ user_id: user.id, balance: 0 }])
            .select()
            .single();
        wallet = newWallet;
    }

    // Fetch Transactions
    let transactions: any[] = [];
    if (wallet) {
        const { data: txs } = await supabase
            .from('transactions')
            .select('*')
            .eq('wallet_id', wallet.id)
            .order('created_at', { ascending: false })
            .limit(50);
            
        if (txs) transactions = txs;
    }

    return <WalletView wallet={wallet} transactions={transactions} email={user.email || ""} />;
}
