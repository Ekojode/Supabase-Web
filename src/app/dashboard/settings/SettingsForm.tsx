'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import { Save, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
    initialData: {
        full_name: string | null
        phone_number: string | null
    }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function action(formData: FormData) {
        setIsPending(true)
        try {
            const result = await updateProfile(formData)
            
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Profile updated successfully!')
                router.refresh()
            }
        } catch (err: any) {
            toast.error(err.message || 'An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={action} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
                <User size={20} className="text-[#4CBBB9]" />
                Personal Information
            </h2>

            <div className="space-y-5">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-[#3A5369] mb-1.5">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-[#3A5369]/40" />
                        </div>
                        <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            defaultValue={initialData.full_name || ''}
                            required
                            className="bg-gray-50 border border-gray-200 text-[#1A1A2E] text-sm rounded-xl focus:ring-[#4CBBB9] focus:border-[#4CBBB9] block w-full pl-10 p-3 transition-colors outline-none"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-[#3A5369] mb-1.5">
                        Phone Number (Optional)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={16} className="text-[#3A5369]/40" />
                        </div>
                        <input
                            type="tel"
                            name="phone_number"
                            id="phone_number"
                            defaultValue={initialData.phone_number || ''}
                            className="bg-gray-50 border border-gray-200 text-[#1A1A2E] text-sm rounded-xl focus:ring-[#4CBBB9] focus:border-[#4CBBB9] block w-full pl-10 p-3 transition-colors outline-none"
                            placeholder="+234..."
                        />
                    </div>
                    <p className="mt-1.5 text-xs text-[#3A5369]/60">Used for group notifications and critical account alerts.</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#1A1A2E] hover:bg-[#2D2D44] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    )
}
