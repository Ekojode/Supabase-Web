-- =======================================================
-- ADD ADMIN SUPPORT - DATABASE MIGRATION
-- Run this script in the Supabase SQL Editor
-- =======================================================

-- 1. Add columns to public.profiles if they do not exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Backfill existing emails from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email <> u.email);

-- 3. Update the handle_new_user() trigger function to sync email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create is_admin() helper function to bypass RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Update Row Level Security (RLS) policies for Admin Access

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile OR admins can read all" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile OR admins can update all" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR public.is_admin());

-- Group Members Policies
DROP POLICY IF EXISTS "Users can read memberships they are part of" ON public.group_members;
CREATE POLICY "Users can read memberships they are part of OR admin" 
  ON public.group_members FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT provider_id FROM public.groups WHERE groups.id = group_members.group_id) OR 
    public.is_admin()
  );

-- Waitlist Policies
DROP POLICY IF EXISTS "Users can manage own waitlist entries" ON public.waitlist;
CREATE POLICY "Users can manage own waitlist entries OR admin" 
  ON public.waitlist 
  USING (auth.uid() = user_id OR public.is_admin());

-- Wallets Policies
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
CREATE POLICY "Users can view own wallet OR admin" 
  ON public.wallets FOR SELECT 
  USING (auth.uid() = user_id OR public.is_admin());

-- Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions OR admin" 
  ON public.transactions FOR SELECT 
  USING (
    wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid()) OR 
    public.is_admin()
  );

-- 6. Promote ekojodeoma@gmail.com to Admin
UPDATE public.profiles
SET is_admin = true
WHERE email = 'ekojodeoma@gmail.com';
