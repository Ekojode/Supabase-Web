"use client";

import { useState } from "react";
import { 
  Search, Users, Wallet, Clock, Layers, ShieldCheck, 
  ChevronDown, ChevronUp, History, ArrowUpRight, ArrowDownLeft 
} from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  reference: string | null;
  status: string;
  created_at: string;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: string;
  wallets: {
    id: string;
    balance: number;
    currency: string;
    transactions: Transaction[];
  } | null;
  groups: {
    id: string;
    status: string;
    total_slots: number;
    price_per_member: number;
    duration_months: number;
    subscriptions: { name: string } | null;
  }[];
  group_members: {
    id: string;
    status: string;
    groups: {
      id: string;
      price_per_member: number;
      duration_months: number;
      subscriptions: { name: string } | null;
    } | null;
  }[];
  waitlist: {
    id: string;
    status: string;
    desired_duration_months: number | null;
    subscriptions: { name: string } | null;
  }[];
};

export default function AdminDashboardClient({ profiles }: { profiles: UserProfile[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [activeTabs, setActiveTabs] = useState<Record<string, 'managed' | 'joined' | 'waitlist' | 'transactions'>>({});

  // Toggle accordion expand/collapse
  const toggleExpand = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    // Set default tab if not set
    if (!activeTabs[userId]) {
      setActiveTabs(prev => ({
        ...prev,
        [userId]: 'managed'
      }));
    }
  };

  const handleTabChange = (userId: string, tab: 'managed' | 'joined' | 'waitlist' | 'transactions') => {
    setActiveTabs(prev => ({
      ...prev,
      [userId]: tab
    }));
  };

  // Filter profiles based on search
  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = profile.full_name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = profile.email?.toLowerCase().includes(searchLower) || false;
    const phoneMatch = profile.phone_number?.includes(searchLower) || false;
    return nameMatch || emailMatch || phoneMatch;
  });

  // Calculate statistics
  const totalUsers = profiles.length;
  const totalWalletBalances = profiles.reduce((sum, p) => sum + Number(p.wallets?.balance || 0), 0);
  
  // Count active groups managed
  const totalManagedGroups = profiles.reduce((sum, p) => sum + p.groups.length, 0);
  
  // Count waitlist items
  const activeWaitlist = profiles.reduce((sum, p) => sum + p.waitlist.filter(w => w.status === 'waiting').length, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2 flex items-center gap-3">
          <ShieldCheck className="text-[#4CBBB9]" size={32} />
          Admin Panel
        </h1>
        <p className="text-[#3A5369]/70">
          Monitor registered users, active subscriptions, wallet ledgers, and platform waitlists.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-[#4CBBB9]/10 rounded-2xl flex items-center justify-center text-[#4CBBB9] flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3A5369]/60 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">{totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3A5369]/60 uppercase tracking-wider">Total Wallet Balances</p>
            <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">₦{totalWalletBalances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-[#1A1A2E]/5 rounded-2xl flex items-center justify-center text-[#1A1A2E] flex-shrink-0">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3A5369]/60 uppercase tracking-wider">Managed Groups</p>
            <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">{totalManagedGroups}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3A5369]/60 uppercase tracking-wider">Waitlist Demands</p>
            <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">{activeWaitlist}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </span>
        <input
          type="text"
          placeholder="Search users by name, email, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl bg-white shadow-sm focus:outline-none focus:border-[#4CBBB9] focus:ring-2 focus:ring-[#4CBBB9]/10 text-sm font-medium transition-all"
        />
      </div>

      {/* Users List Accordion */}
      <div className="space-y-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => {
            const isExpanded = !!expandedUsers[profile.id];
            const activeTab = activeTabs[profile.id] || 'managed';
            const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            // Initials for avatar fallback
            const nameParts = profile.full_name?.split(" ") || [];
            const initials = nameParts.length > 1 
              ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
              : (profile.full_name?.[0] || profile.email?.[0] || "?").toUpperCase();

            return (
              <div 
                key={profile.id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors overflow-hidden"
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleExpand(profile.id)}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || "User Avatar"} 
                        className="w-12 h-12 rounded-2xl object-cover bg-gray-50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#4CBBB9]/10 text-[#4CBBB9] flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#1A1A2E] text-base">
                          {profile.full_name || "Unnamed User"}
                        </h4>
                        {profile.is_admin && (
                          <span className="bg-[#4CBBB9]/10 text-[#4CBBB9] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={10} />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#3A5369]/70 font-medium mt-0.5">{profile.email}</p>
                      {profile.phone_number && (
                        <p className="text-[11px] text-[#3A5369]/50 font-medium mt-0.5">{profile.phone_number}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#3A5369]/50 uppercase tracking-wider block">Wallet Balance</span>
                      <span className="font-bold text-sm text-[#1A1A2E]">
                        ₦{Number(profile.wallets?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#3A5369]/50 uppercase tracking-wider block">Joined Platform</span>
                      <span className="text-xs font-semibold text-[#3A5369]">{joinedDate}</span>
                    </div>

                    <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-[#3A5369] transition-colors">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Accordion Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-50 bg-gray-50/30 p-6 sm:p-8">
                    {/* Inner Tabs */}
                    <div className="flex border-b border-gray-100 mb-6 overflow-x-auto gap-2">
                      <button 
                        onClick={() => handleTabChange(profile.id, 'managed')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-3 transition-colors ${
                          activeTab === 'managed' 
                            ? "border-[#4CBBB9] text-[#4CBBB9]" 
                            : "border-transparent text-[#3A5369]/60 hover:text-[#1A1A2E]"
                        }`}
                      >
                        Groups Managed ({profile.groups?.length || 0})
                      </button>
                      <button 
                        onClick={() => handleTabChange(profile.id, 'joined')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-3 transition-colors ${
                          activeTab === 'joined' 
                            ? "border-[#4CBBB9] text-[#4CBBB9]" 
                            : "border-transparent text-[#3A5369]/60 hover:text-[#1A1A2E]"
                        }`}
                      >
                        Groups Joined ({profile.group_members?.length || 0})
                      </button>
                      <button 
                        onClick={() => handleTabChange(profile.id, 'waitlist')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-3 transition-colors ${
                          activeTab === 'waitlist' 
                            ? "border-[#4CBBB9] text-[#4CBBB9]" 
                            : "border-transparent text-[#3A5369]/60 hover:text-[#1A1A2E]"
                        }`}
                      >
                        Waitlist ({profile.waitlist?.length || 0})
                      </button>
                      <button 
                        onClick={() => handleTabChange(profile.id, 'transactions')}
                        className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-3 transition-colors ${
                          activeTab === 'transactions' 
                            ? "border-[#4CBBB9] text-[#4CBBB9]" 
                            : "border-transparent text-[#3A5369]/60 hover:text-[#1A1A2E]"
                        }`}
                      >
                        Wallet & Transactions ({profile.wallets?.transactions?.length || 0})
                      </button>
                    </div>

                    {/* Tab Panels */}
                    {activeTab === 'managed' && (
                      <div className="space-y-3">
                        {profile.groups && profile.groups.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.groups.map(group => (
                              <div key={group.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div>
                                  <h5 className="font-bold text-sm text-[#1A1A2E]">{group.subscriptions?.name}</h5>
                                  <p className="text-xs text-[#3A5369]/70 mt-1">
                                    ₦{Number(group.price_per_member).toLocaleString()} / member • {group.duration_months} mo
                                  </p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  group.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {group.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#3A5369]/50 py-4 italic">No groups managed by this user.</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'joined' && (
                      <div className="space-y-3">
                        {profile.group_members && profile.group_members.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.group_members.map(member => (
                              <div key={member.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div>
                                  <h5 className="font-bold text-sm text-[#1A1A2E]">
                                    {member.groups?.subscriptions?.name || 'Unknown Service'}
                                  </h5>
                                  <p className="text-xs text-[#3A5369]/70 mt-1">
                                    Price: ₦{Number(member.groups?.price_per_member || 0).toLocaleString()} • {member.groups?.duration_months || 0} mo
                                  </p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  member.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {member.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#3A5369]/50 py-4 italic">No groups joined by this user.</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'waitlist' && (
                      <div className="space-y-3">
                        {profile.waitlist && profile.waitlist.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.waitlist.map(wait => (
                              <div key={wait.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div>
                                  <h5 className="font-bold text-sm text-[#1A1A2E]">{wait.subscriptions?.name}</h5>
                                  <p className="text-xs text-[#3A5369]/70 mt-1">
                                    Desired duration: {wait.desired_duration_months || 'flexible'} mo
                                  </p>
                                </div>
                                <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {wait.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#3A5369]/50 py-4 italic">No waitlist entries found for this user.</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'transactions' && (
                      <div className="space-y-3">
                        {profile.wallets?.transactions && profile.wallets.transactions.length > 0 ? (
                          <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                              {profile.wallets.transactions
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map(tx => {
                                  const txDate = new Date(tx.created_at).toLocaleString();
                                  const isOutflow = tx.type === 'commitment' || tx.type === 'withdrawal';
                                  
                                  return (
                                    <div key={tx.id} className="p-4 flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          isOutflow ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                                        }`}>
                                          {isOutflow ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                        </div>
                                        <div>
                                          <p className="font-bold text-[#1A1A2E] uppercase text-xs tracking-wider">{tx.type.replace('_', ' ')}</p>
                                          <p className="text-[10px] text-[#3A5369]/50 mt-0.5">{txDate}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className={`font-bold text-sm ${
                                          isOutflow ? "text-red-500" : "text-emerald-500"
                                        }`}>
                                          {isOutflow ? "-" : "+"}₦{Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className={`block text-[10px] uppercase font-bold mt-0.5 ${
                                          tx.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                          {tx.status}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-[#3A5369]/50 py-4 italic">No transaction records found for this user.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[#3A5369]/60 text-sm">No registered users matched your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
