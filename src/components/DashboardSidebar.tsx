"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Wallet, LogOut, Settings } from "lucide-react";
import SubbBayLogo from "@/components/SubbBayLogo";
import { logout } from "@/app/login/actions";

export default function DashboardSidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const navItems = [
        { name: "My Groups", href: "/dashboard", icon: LayoutDashboard },
        { name: "Browse", href: "/dashboard/browse", icon: Compass },
        { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-40">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
                <Link href="/dashboard">
                    <SubbBayLogo size="sm" />
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                ? "bg-[#4CBBB9]/10 text-[#4CBBB9]"
                                : "text-[#3A5369] hover:bg-gray-50 hover:text-[#1A1A2E]"
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "text-[#4CBBB9]" : "text-[#3A5369]/70"} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-[#3A5369]/60 font-medium mb-1">Logged in as</p>
                    <p className="text-sm font-bold text-[#1A1A2E] truncate">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </p>
                </div>

                <form action={logout}>
                    <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={20} />
                        Log Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
