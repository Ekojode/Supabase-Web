import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verify server-side that this user is indeed an admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        redirect('/dashboard')
    }

    // Fetch all user profiles, including wallet, groups managed, groups joined, and waitlist items
    const { data: rawProfiles, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            phone_number,
            email,
            is_admin,
            created_at,
            wallets (
                id,
                balance,
                currency,
                transactions (
                    id,
                    amount,
                    type,
                    reference,
                    status,
                    created_at
                )
            ),
            groups (
                id,
                status,
                total_slots,
                price_per_member,
                duration_months,
                subscriptions ( name )
            ),
            group_members (
                id,
                status,
                groups (
                    id,
                    price_per_member,
                    duration_months,
                    subscriptions ( name )
                )
            ),
            waitlist (
                id,
                status,
                desired_duration_months,
                subscriptions ( name )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin dashboard data:', error);
    }

    const profiles = rawProfiles || [];

    return (
        <div className="max-w-6xl mx-auto">
            <AdminDashboardClient profiles={profiles as any} />
        </div>
    )
}
