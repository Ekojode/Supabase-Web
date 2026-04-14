'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()
    const nextPath = (formData.get('next') as string) || '/dashboard'

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect(`/login?error=Invalid email or password&next=${encodeURIComponent(nextPath)}`)
    }

    revalidatePath('/', 'layout')
    redirect(nextPath)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const nextPath = (formData.get('next') as string) || '/dashboard'

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('fullName') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`)
    }

    revalidatePath('/', 'layout')
    redirect(nextPath) // Or to a 'check email' page if email confirmation is turned on
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}
