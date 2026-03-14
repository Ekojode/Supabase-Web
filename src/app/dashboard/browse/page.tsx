import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BrowsePage() {
    const supabase = await createClient()

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Fetch Open Groups
    const { data: openGroups, error } = await supabase
        .from('groups')
        .select(`
            id,
            status,
            total_slots,
            price_per_member,
            duration_months,
            subscriptions (
                name,
                description
            ),
            profiles:provider_id (
                full_name,
                avatar_url
            ),
            group_members ( count )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">
                    Marketplace 🚀
                </h1>
                <p className="text-[#3A5369]/70">
                    Find and join verified subscription groups created by others.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">
                    Failed to load groups. Please refresh.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openGroups && openGroups.length > 0 ? (
                    openGroups.map((group: any) => {
                        // Using NextJS 15 count syntax extraction
                        const membersCount = group.group_members?.[0]?.count || 0;
                        const slotsLeft = group.total_slots - membersCount;

                        return (
                            <Link href={`/dashboard/groups/${group.id}`} key={group.id} className="bg-white border text-left border-gray-100 p-6 rounded-3xl hover:-translate-y-1 transition-transform shadow-sm flex flex-col h-full group">

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1A1A2E] mb-1">
                                            {group.subscriptions?.name}
                                        </h3>
                                        <p className="text-xs font-semibold text-[#4CBBB9] bg-[#4CBBB9]/10 inline-block px-2 py-1 rounded-md">
                                            {group.duration_months} Months
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-[#1A1A2E]">
                                            ₦{Number(group.price_per_member).toLocaleString()}<span className="text-xs text-[#3A5369]/60 font-medium">/mo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm">
                                        {group.profiles?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#3A5369]/60 font-medium">Hosted by</p>
                                        <p className="text-sm font-bold text-[#1A1A2E]">
                                            {group.profiles?.full_name || 'Anonymous User'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-[#3A5369]/60 font-medium mb-1">Availability</span>
                                        <span className={`text-sm font-bold ${slotsLeft <= 1 ? 'text-red-500' : 'text-[#4CBBB9]'}`}>
                                            {slotsLeft} slots left
                                        </span>
                                    </div>
                                    <div className="bg-[#1A1A2E] hover:bg-[#2D2D44] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                                        View & Join
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">No active groups found</h3>
                        <p className="text-[#3A5369]/60 max-w-sm mx-auto mb-6">
                            There are currently no open groups looking for members. Check back later or start your own!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
