import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
    const supabase = await createClient()

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Fetch User Profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        // Log unexpected error, but don't crash if profile doesn't exist yet (handled below)
        console.error('Error fetching profile:', error)
    }

    // 3. Prepare initial data (fallback to auth metadata if profile row is missing)
    const initialData = {
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        phone_number: profile?.phone_number || ''
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">
                    Account Settings
                </h1>
                <p className="text-[#3A5369]/70">
                    Manage your personal information and preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <section>
                    <SettingsForm initialData={initialData} />
                </section>
                
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
                     <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">
                        Email & Account
                    </h2>
                    <p className="text-sm text-[#3A5369]/70 mb-4">
                        Your account is linked to the email address you signed up with. Email changes are currently not supported via the dashboard.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A2E] font-medium flex items-center justify-between">
                        <span>{user.email}</span>
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">Verified</span>
                    </div>
                </section>
            </div>
        </div>
    )
}
