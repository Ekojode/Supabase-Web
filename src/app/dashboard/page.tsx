import { createClient } from '@/utils/supabase/server'
import CreateGroupButton from '@/components/CreateGroupButton'
import Link from 'next/link'

export default async function DashboardPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const action = searchParams.action;
    const initialService = searchParams.service as string | undefined;
    const initialDuration = searchParams.duration ? parseInt(searchParams.duration as string) : undefined;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null;

    // Fetch Managed Groups
    const { data: managedGroups } = await supabase
        .from('groups')
        .select(`
        id,
        status,
        total_slots,
        price_per_member,
        duration_months,
        subscriptions ( name ),
        group_members ( count )
    `)
        .eq('provider_id', user.id);

    // Fetch Joined Groups
    const { data: joinedGroups } = await supabase
        .from('group_members')
        .select(`
        id,
        status,
        expires_at,
        groups (
            id,
            status,
            total_slots,
            subscriptions ( name ),
            group_members ( count )
        )
    `)
        .eq('user_id', user.id);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">
                        Welcome back, <span className="text-[#4CBBB9]">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-[#3A5369]/70">
                        Manage your shared subscriptions and groups.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <CreateGroupButton 
                        className="bg-[#1A1A2E] hover:bg-[#2D2D44] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm" 
                        autoOpen={action === 'create'}
                        initialData={{ subscription: initialService, duration: initialDuration }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Managed Groups */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[#1A1A2E]">Groups I Manage</h2>
                        <span className="bg-gray-100 text-[#3A5369] text-xs font-bold px-3 py-1 rounded-full">{managedGroups?.length || 0}</span>
                    </div>

                    {managedGroups && managedGroups.length > 0 ? (
                        <div className="space-y-4">
                            {managedGroups.map((group: any) => (
                                <Link href={`/dashboard/groups/${group.id}`} key={group.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-100 hover:border-gray-200 transition-colors group">
                                    <div>
                                        <h3 className="font-bold text-[#1A1A2E] group-hover:text-[#4CBBB9] transition-colors">{group.subscriptions?.name}</h3>
                                        <p className="text-xs text-[#3A5369]/70 mt-1">
                                            <span className="font-semibold text-[#1A1A2E]">₦{Number(group.price_per_member).toLocaleString()}</span> • {group.group_members?.[0]?.count || 0}/{group.total_slots} filled • {group.duration_months} mo
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${group.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {group.status}
                                        </span>
                                        <span className="text-[#3A5369]/40 group-hover:text-[#1A1A2E] transition-colors ml-2">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-[#3A5369]/60 text-sm mb-4">You aren't managing any groups yet.</p>
                            <CreateGroupButton 
                                initialData={{ subscription: initialService, duration: initialDuration }}
                            />
                        </div>
                    )}
                </div>

                {/* Joined Groups */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[#1A1A2E]">Groups I've Joined</h2>
                        <span className="bg-gray-100 text-[#3A5369] text-xs font-bold px-3 py-1 rounded-full">{joinedGroups?.length || 0}</span>
                    </div>

                    {joinedGroups && joinedGroups.length > 0 ? (
                        <div className="space-y-4">
                            {joinedGroups.map((membership: any) => (
                                <Link href={`/dashboard/groups/${membership.groups?.id}`} key={membership.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-100 hover:border-gray-200 transition-colors group">
                                    <div>
                                        <h3 className="font-bold text-[#1A1A2E] group-hover:text-[#4CBBB9] transition-colors">{membership.groups?.subscriptions?.name}</h3>
                                        <p className="text-xs text-[#3A5369]/70 mt-1">
                                            Status: <span className="font-semibold">{membership.status}</span> • {membership.groups?.group_members?.[0]?.count || 0}/{membership.groups?.total_slots} filled
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {membership.expires_at && (
                                            <div className="text-right">
                                                <span className="text-xs text-[#3A5369]/60 block mb-1">Expires</span>
                                                <span className="text-sm font-bold text-[#1A1A2E]">{new Date(membership.expires_at).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <span className="text-xs font-bold text-[#4CBBB9] whitespace-nowrap ml-2">
                                            View Vault →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-[#3A5369]/60 text-sm mb-4">You haven't joined any groups yet.</p>
                            <Link href="/dashboard/browse" className="inline-block border border-[#1A1A2E] text-[#1A1A2E] hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                Browse Groups
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
