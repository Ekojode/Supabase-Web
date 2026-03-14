-- ==========================================
-- SUBBAY - V2 SUPABASE SQL SCHEMA
-- Core Application Entities: Groups, Wallets, Waitlists
-- ==========================================

-- 1. Profiles (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Subscriptions (Catalog of services)
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2),
    max_members INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Groups (Created by Providers)
CREATE TABLE public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE RESTRICT,
    total_slots INTEGER NOT NULL,
    duration_months INTEGER NOT NULL,
    price_per_member DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'filled', 'active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- 4. Group Members (Consumers joining a group)
CREATE TABLE public.group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'active', 'expired', 'left')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(group_id, user_id)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- 5. Waitlist (Demand Pooling)
CREATE TABLE public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    desired_duration_months INTEGER,
    status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 6. Group Vaults (Secure Credential Storage)
CREATE TABLE public.group_vaults (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE UNIQUE,
    login_email TEXT,
    login_password TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.group_vaults ENABLE ROW LEVEL SECURITY;

-- 7. Wallets (Financial Ledger)
CREATE TABLE public.wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'NGN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 8. Transactions (Ledger Entries)
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'commitment', 're_aggregation_adjustment', 'refund')),
    reference TEXT, -- e.g. group_id or payment gateway reference
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles: Users can read and update their own profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: Anyone can read subscriptions
CREATE POLICY "Anyone can read subscriptions" ON public.subscriptions FOR SELECT USING (true);

-- Groups: Anyone can read groups, only providers can insert/update their groups
CREATE POLICY "Anyone can read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Providers can insert groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update their groups" ON public.groups FOR UPDATE USING (auth.uid() = provider_id);

-- Group Members: Users can read members of groups they are in, or if they are the provider
CREATE POLICY "Users can read memberships they are part of" ON public.group_members FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT provider_id FROM public.groups WHERE groups.id = group_members.group_id)
);
CREATE POLICY "Users can insert their own membership" ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Waitlist: Users can see and manage their own waitlist entries
CREATE POLICY "Users can manage own waitlist entries" ON public.waitlist USING (auth.uid() = user_id);

-- Group Vaults: 
-- 1. Providers can manage their own vault details
CREATE POLICY "Providers manage vault" ON public.group_vaults USING (
    auth.uid() IN (SELECT provider_id FROM public.groups WHERE groups.id = group_vaults.group_id)
);
-- 2. Active members can READ the vault
CREATE POLICY "Active members can read vault" ON public.group_vaults FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.group_members WHERE group_id = group_vaults.group_id AND status = 'active')
);

-- Wallets: Users can see their own wallet
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- Transactions: Users can see their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
    wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
);
