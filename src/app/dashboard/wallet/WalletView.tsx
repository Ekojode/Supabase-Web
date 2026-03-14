"use client";

import { useState } from "react";
import { Plus, Wallet, ArrowRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { depositFunds } from "./actions";

export default function WalletPage({ wallet, transactions }: { wallet: any, transactions: any[] }) {
    const [isDepositing, setIsDepositing] = useState(false);
    const [amount, setAmount] = useState<string>("5000");

    const handleDeposit = async () => {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsDepositing(true);
        const result = await depositFunds(numAmount);
        
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`Successfully deposited ₦${numAmount.toLocaleString()}!`);
            setAmount("5000"); // Reset
        }
        setIsDepositing(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">My Wallet</h1>
                <p className="text-[#3A5369]/70">Manage your balance and view transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Balance Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D44] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <Wallet size={18} />
                            <span className="text-sm font-medium uppercase tracking-wider">Available Balance</span>
                        </div>
                        <div className="text-4xl md:text-5xl font-bold mb-8">
                            ₦{Number(wallet?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('deposit-section');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-[#4CBBB9] hover:bg-[#3daaa8] text-[#1A1A2E] px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Fund Wallet
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col justify-center shadow-sm">
                    <div className="mb-6">
                        <p className="text-xs text-[#3A5369]/60 font-bold uppercase tracking-wider mb-1">Total Spent</p>
                        <p className="text-2xl font-bold text-[#1A1A2E]">
                            ₦{transactions.filter(t => t.type === 'commitment' || t.type === 'withdrawal').reduce((acc, t) => acc + Number(t.amount), 0).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-[#3A5369]/60 font-bold uppercase tracking-wider mb-1">Total Added</p>
                        <p className="text-xl font-bold text-[#4CBBB9]">
                            +₦{transactions.filter(t => t.type === 'deposit').reduce((acc, t) => acc + Number(t.amount), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Deposit Section (Mock) */}
            <div id="deposit-section" className="bg-indigo-50/50 rounded-3xl p-8 mb-10 border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                    <Wallet size={200} />
                </div>
                <div className="relative z-10 max-w-md">
                    <h2 className="text-xl font-bold text-[#1A1A2E] mb-2 flex items-center gap-2">
                        <Plus size={20} className="text-[#4CBBB9]" /> 
                        Quick Deposit (Mocked)
                    </h2>
                    <p className="text-sm text-[#3A5369]/70 mb-6">Instantly add funds to your wallet for testing purposes. No real money gets moved here.</p>
                    
                    <div className="flex gap-3 mb-4">
                        {[1000, 5000, 10000].map(val => (
                            <button 
                                key={val}
                                onClick={() => setAmount(val.toString())}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                    amount === val.toString() 
                                    ? 'bg-[#1A1A2E] text-white' 
                                    : 'bg-white text-[#3A5369] border border-gray-200 hover:border-[#1A1A2E]'
                                }`}
                            >
                                ₦{val.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A5369]/60 font-medium">₦</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CBBB9]/50 transition-all font-semibold"
                                placeholder="Amount"
                            />
                        </div>
                        <button 
                            onClick={handleDeposit}
                            disabled={isDepositing}
                            className="bg-[#1A1A2E] hover:bg-[#2D2D44] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            {isDepositing ? 'Processing...' : 'Deposit'}
                            {!isDepositing && <ArrowRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">Recent Transactions</h2>
                
                {transactions.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet size={24} className="text-gray-400" />
                        </div>
                        <p className="text-[#3A5369]/60 font-medium">No transactions yet.</p>
                        <p className="text-sm text-[#3A5369]/40 mt-1">Fund your wallet to see activity here.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="divide-y divide-gray-100">
                            {transactions.map(tx => (
                                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                            tx.type === 'deposit' ? 'bg-green-100 text-green-600' :
                                            tx.type === 'commitment' ? 'bg-orange-100 text-orange-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1A1A2E] capitalize">
                                                {tx.type === 'commitment' ? 'Group Payment' : tx.type}
                                            </p>
                                            <p className="text-xs text-[#3A5369]/60 mt-0.5">
                                                {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${
                                            tx.type === 'deposit' ? 'text-green-600' : 'text-[#1A1A2E]'
                                        }`}>
                                            {tx.type === 'deposit' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
                                        </p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-1 inline-block ${
                                            tx.status === 'completed' ? 'bg-green-50 text-green-700' : 
                                            tx.status === 'pending' ? 'bg-orange-50 text-orange-700' : 
                                            'bg-red-50 text-red-700'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
