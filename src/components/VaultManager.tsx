'use client';

import { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

export default function VaultManager({ groupId, readOnly = false }: { groupId: string, readOnly?: boolean }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<null | 'success' | 'error' | 'copied'>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const res = await fetch(`/api/groups/${groupId}/vault`);
                const data = await res.json();
                if (data?.vault) {
                    setEmail(data.vault.login_email || '');
                    setPassword(data.vault.login_password || '');
                }
            } catch (err) {
                console.error("Failed to load vault:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVault();
    }, [groupId]);

    const handleSave = async () => {
        if (readOnly) return;
        setIsSaving(true);
        setStatus(null);
        setErrorMessage('');

        try {
            const res = await fetch(`/api/groups/${groupId}/vault`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login_email: email, login_password: password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to save');

            setStatus('success');
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setStatus('copied');
        setTimeout(() => setStatus(null), 2000);
    }

    if (isLoading) {
        return <div className="animate-pulse bg-white/5 h-40 rounded-2xl w-full border border-white/10" />
    }

    return (
        <div className="bg-black/20 rounded-2xl p-4 border border-white/10 relative z-10">
            {status === 'error' && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl flex items-start gap-2 text-sm">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            {status === 'success' && (
                <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-200 p-3 rounded-xl flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} />
                    <p>Vault securely updated!</p>
                </div>
            )}

            {status === 'copied' && (
                <div className="mb-4 bg-[#4CBBB9]/10 border border-[#4CBBB9]/20 text-[#4CBBB9] p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                    <CheckCircle2 size={16} />
                    <p>Copied to clipboard</p>
                </div>
            )}

            <div className={`mb-${readOnly ? '2' : '4'}`}>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Login Email</label>
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={readOnly ? "Not provided yet" : "e.g., netflix@myemail.com"}
                        readOnly={readOnly}
                        className={`bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/30 ${readOnly ? 'cursor-default' : ''}`}
                    />
                    {readOnly && email && (
                        <button onClick={() => handleCopy(email)} className="text-[#4CBBB9] hover:text-white transition-colors flex-shrink-0 ml-2">
                            <Copy size={16} />
                        </button>
                    )}
                </div>
            </div>
            <div className={`mb-${readOnly ? '2' : '4'}`}>
                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={readOnly ? "Not provided yet" : "••••••••••••"}
                        readOnly={readOnly}
                        className={`bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/30 ${readOnly ? 'cursor-default' : ''}`}
                    />
                    {readOnly && password && (
                        <button onClick={() => handleCopy(password)} className="text-[#4CBBB9] hover:text-white transition-colors flex-shrink-0 ml-2">
                            <Copy size={16} />
                        </button>
                    )}
                </div>
            </div>

            {!readOnly && (
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-[#4CBBB9] hover:bg-[#3AA8A6] disabled:bg-[#4CBBB9]/50 disabled:cursor-not-allowed text-[#1A1A2E] font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-4">
                    <Key size={16} /> {isSaving ? "Securing..." : "Update Vault"}
                </button>
            )}
        </div>
    );
}
