import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Shield, Copy, CheckCircle2, Clock } from 'lucide-react'
import VaultManager from '@/components/VaultManager'
import PaymentProcessor from './PaymentProcessor'

export default async function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const resolvedParams = await params;

    // 2. Fetch Group & Vault Details, ensuring this user is the Provider OR a paid member
    // For now, we are designing the "Provider View" first.
    const { data: group, error } = await supabase
        .from('groups')
        .select(`
            id,
            status,
            total_slots,
            price_per_member,
            duration_months,
            provider_id,
            created_at,
            subscriptions ( name ),
            group_members (
                id,
                status,
                joined_at,
                profiles ( full_name, phone_number )
            )
        `)
        .eq('id', resolvedParams.id)
        .single()

    if (error || !group) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <p className="text-red-500 mb-4">Group not found or you don't have access.</p>
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-left font-mono text-sm max-w-lg mx-auto mb-6 break-words">
                        <p className="font-bold">Supabase Error:</p>
                        <p>{error.message || JSON.stringify(error)}</p>
                        {error.details && <p className="mt-2 text-xs opacity-80">Details: {error.details}</p>}
                        {error.hint && <p className="mt-2 text-xs opacity-80">Hint: {error.hint}</p>}
                    </div>
                )}
                <Link href="/dashboard" className="text-[#4CBBB9] hover:underline">Return to Dashboard</Link>
            </div>
        )
    }

    // 3. Find this specific user's membership to check their payment status
    const membership = group.group_members?.find((m: any) => m.profiles?.email === user.email || m.profiles?.full_name === user.user_metadata?.full_name);
    const isMemberActive = membership?.status === 'active';

    const membersCount = group.group_members?.length || 0
    const filledPercentage = (membersCount / group.total_slots) * 100

    const isProvider = group.provider_id === user.id

    // ==========================================
    // MEMBER VIEW RETURN
    // ==========================================
    if (!isProvider) {
        return (
            <div className="max-w-4xl mx-auto pb-12 pt-8 px-6">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-[#3A5369]/70 hover:text-[#1A1A2E] transition-colors mb-4">
                        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-[#1A1A2E] flex items-center gap-3">
                        {(group.subscriptions as any)?.name} Group
                        <span className="bg-[#4CBBB9]/10 text-[#4CBBB9] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider translate-y-[-2px]">
                            Member Access
                        </span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Stats & Roster */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Your Price</p>
                                <p className="text-lg font-bold text-[#1A1A2E]">₦{Number(group.price_per_member).toLocaleString()}<span className="text-xs font-medium text-[#3A5369]/60">/mo</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Commitment</p>
                                <p className="text-lg font-bold text-[#1A1A2E]">{group.duration_months} Months</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Total Slots</p>
                                <p className="text-lg font-bold text-[#1A1A2E]">{group.total_slots}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2 mb-6">
                                <Users size={20} className="text-[#4CBBB9]" />
                                Fellow Members
                            </h2>
                            <div className="space-y-3">
                                {group.group_members?.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#1A1A2E] shadow-sm">
                                                {member.profiles?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1A1A2E] text-sm">{member.profiles?.full_name || 'Anonymous User'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: The Secure Vault */}
                    <div className="space-y-6">
                        <div className="bg-[#1A1A2E] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-start gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Shield size={20} className="text-[#4CBBB9]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Secure Vault</h2>
                                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                        Credentials are locked via Escrow.
                                    </p>
                                </div>
                            </div>

                            {isMemberActive ? (
                                <VaultManager groupId={group.id} readOnly={true} />
                            ) : (
                                <div className="bg-black/20 rounded-2xl p-6 border border-white/10 relative z-10 text-center">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-3">
                                        <Clock size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-white mb-2">Payment Required</p>
                                    <p className="text-xs text-white/60 mb-4">You must commit to Escrow before the Provider's credentials are revealed to you.</p>
                                    <PaymentProcessor 
                                        groupId={group.id} 
                                        membershipId={membership?.id || ''} 
                                        amount={group.price_per_member} 
                                        duration={group.duration_months} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ==========================================
    // PROVIDER VIEW RETURN
    // ==========================================
    return (
        <div className="max-w-4xl mx-auto pb-12">

            {/* Header Navigation */}
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-[#3A5369]/70 hover:text-[#1A1A2E] transition-colors mb-4">
                    <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A2E] flex items-center gap-3">
                            {(group.subscriptions as any)?.name} Group
                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider translate-y-[-2px] ${group.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {group.status}
                            </span>
                        </h1>
                        <p className="text-[#3A5369]/70 mt-1">
                            Created on {new Date(group.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Management & Stats */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Master Stats Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Price per member</p>
                            <p className="text-lg font-bold text-[#1A1A2E]">₦{Number(group.price_per_member).toLocaleString()}<span className="text-xs font-medium text-[#3A5369]/60">/mo</span></p>
                        </div>
                        <div>
                            <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Commitment</p>
                            <p className="text-lg font-bold text-[#1A1A2E]">{group.duration_months} Months</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Total Slots</p>
                            <p className="text-lg font-bold text-[#1A1A2E]">{group.total_slots}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Expected Payout</p>
                            <p className="text-lg font-bold text-[#4CBBB9]">
                                ₦{Number(group.price_per_member * (group.total_slots - 1) * group.duration_months).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Roster & Members */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                                <Users size={20} className="text-[#4CBBB9]" />
                                Member Roster
                            </h2>
                            <div className="text-sm font-semibold text-[#3A5369]">
                                {membersCount} / {group.total_slots} Slots Filled
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-[#4CBBB9] transition-all" style={{ width: `${filledPercentage}%` }} />
                        </div>

                        <div className="space-y-3">
                            {group.group_members && group.group_members.length > 0 ? (
                                group.group_members.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#1A1A2E] shadow-sm">
                                                {member.profiles?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1A1A2E] text-sm">{member.profiles?.full_name || 'Anonymous User'}</p>
                                                <p className="text-xs text-[#3A5369]/70">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {member.status === 'active' ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-lg">
                                                    <CheckCircle2 size={14} /> Paid & Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-lg">
                                                    <Clock size={14} /> Pending Payment
                                                </span>
                                            )}
                                                </div>
                                    </div>
                                        ))
                                        ) : (
                                        <p className="text-sm text-[#3A5369]/60 text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                                            No members have joined your group yet. Send them the link to fill your slots!
                                        </p>
                            )}
                                    </div>
                    </div>
                    </div>

                    {/* Right Column: Password Vault */}
                    <div className="space-y-6">
                        <div className="bg-[#1A1A2E] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                            {/* Background Decor */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-start gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Shield size={20} className="text-[#4CBBB9]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Password Vault</h2>
                                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                        Securely store the {(group.subscriptions as any)?.name} credentials. They will only be revealed to members who have successfully funded escrow.
                                    </p>
                                </div>
                            </div>

                            {/* Vault Form Component */}
                            <VaultManager groupId={group.id} />
                        </div>

                        {/* Share Link Card */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1A1A2E] mb-2 text-sm">Recruit Members</h3>
                            <p className="text-xs text-[#3A5369]/70 mb-4 block">Share this direct link to instantly onboard friends into this specific group.</p>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                                <input type="text" readOnly value={`subbay.com/join/${group.id.slice(0, 8)}`} className="bg-transparent text-sm text-[#3A5369] font-medium px-3 outline-none w-full" />
                                <button className="bg-white border border-gray-200 text-[#1A1A2E] p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            )
}
