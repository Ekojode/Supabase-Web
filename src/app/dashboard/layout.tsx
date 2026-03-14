import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DashboardSidebar user={user} />
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 relative w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}
