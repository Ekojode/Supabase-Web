'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('full_name') as string
    const phoneNumber = formData.get('phone_number') as string

    if (!fullName || fullName.trim() === '') {
        return { error: 'Full name is required' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName.trim(),
            phone_number: phoneNumber ? phoneNumber.trim() : null
        })
        .eq('id', user.id)

    if (error) {
        console.error('Failed to update profile:', error)
        return { error: error.message || 'Failed to update profile' }
    }

    // Attempt to update the user metadata in auth.users as well for consistency
    await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
    })

    revalidatePath('/dashboard/settings')
    
    return { success: true }
}
