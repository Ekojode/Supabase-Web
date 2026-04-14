'use client'

import { useState, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup } from './actions'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'
import SubbBayLogo from '@/components/SubbBayLogo'
import Link from 'next/link'

function LoginFormContent() {
    const searchParams = useSearchParams()
    const errorParam = searchParams.get('error')

    const [isLogin, setIsLogin] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [actionError, setActionError] = useState('')

    const displayError = actionError || errorParam

    const handleSubmit = (formData: FormData) => {
        setActionError('')
        startTransition(async () => {
            try {
                if (isLogin) {
                    await login(formData)
                } else {
                    await signup(formData)
                }
            } catch (err: any) {
                // Redirection throws an error we need to let pass, 
                // but real errors we can catch here if actions are updated to return them
                console.error(err)
            }
        })
    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(true); setActionError(''); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-[#1A1A2E] shadow-sm' : 'text-[#3A5369]/60 hover:text-[#1A1A2E]'}`}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(false); setActionError(''); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-[#1A1A2E] shadow-sm' : 'text-[#3A5369]/60 hover:text-[#1A1A2E]'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <input type="hidden" name="next" value={searchParams.get('next') || ''} />
                    {displayError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                            {displayError}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Only show Full Name on Sign Up */}
                        {!isLogin && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#3A5369]/60 mb-2 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required={!isLogin}
                                        placeholder="John Doe"
                                        className="w-full bg-gray-50 border border-gray-200 text-[#1A1A2E] p-4 !pl-12 rounded-xl focus:outline-none focus:border-[#4CBBB9] focus:ring-1 focus:ring-[#4CBBB9] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#3A5369]/60 mb-2 ml-1">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A2E] p-4 !pl-12 rounded-xl focus:outline-none focus:border-[#4CBBB9] focus:ring-1 focus:ring-[#4CBBB9] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#3A5369]/60 mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 text-[#1A1A2E] p-4 !pl-12 rounded-xl focus:outline-none focus:border-[#4CBBB9] focus:ring-1 focus:ring-[#4CBBB9] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={isPending}
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-[#1A1A2E] hover:bg-[#2D2D44] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? (
                                'Processing...'
                            ) : isLogin ? (
                                'Log In'
                            ) : (
                                <>Sign Up <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </form>

                {/* Note about email confirmation for testing */}
                {!isLogin && (
                    <p className="mt-6 text-center text-xs text-[#3A5369]/50 max-w-xs mx-auto">
                        Note: Email confirmation is currently disabled for testing. You will be logged in immediately.
                    </p>
                )}
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex text-[#1A1A2E] bg-gray-50 flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <Link href="/" className="mb-6">
                    <SubbBayLogo size="md" />
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-[#1A1A2E]">
                    Welcome to Subbay
                </h2>
                <p className="mt-2 text-center text-sm text-[#3A5369]">
                    Manage your subscriptions effortlessly
                </p>
            </div>

            <Suspense fallback={
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-12 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A1A2E]"></div>
                    </div>
                </div>
            }>
                <LoginFormContent />
            </Suspense>
        </div>
    )
}
