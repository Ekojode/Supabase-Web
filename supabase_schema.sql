-- ==========================================
-- SUBB BAY - SUPABASE SQL SCHEMA
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Create the Waitlist Users Table
-- This is the single source of truth for anyone who interacts with the landing page.
CREATE TABLE public.waitlist_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    
    -- Tracks if they got the generic "Welcome to the Waitlist" email.
    -- If they joined by creating a group first, we won't send this generic email.
    welcome_email_sent BOOLEAN DEFAULT FALSE,
    
    -- Tracks how they originally found us/interacted first
    joined_via_group_creation BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for waitlist_users
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (since people on the landing page aren't logged in yet)
CREATE POLICY "Enable insert for anonymous users" ON public.waitlist_users
    FOR INSERT WITH CHECK (true);

-- 2. Create the User Groups Table
-- This tracks every individual group a user tries to create.
-- A user can have multiple rows here (One-to-Many relationship).
CREATE TABLE public.user_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Foreign Key linking to the waitlist_users table
    -- If the user is deleted, their group requests are deleted (CASCADE)
    user_id UUID REFERENCES public.waitlist_users(id) ON DELETE CASCADE,
    
    service_name TEXT NOT NULL, -- e.g., 'Netflix', 'Spotify', 'Other'
    custom_name TEXT,           -- Used if service_name is 'Other'
    expected_price TEXT,        -- The price they entered/expected
    slots INTEGER NOT NULL,     -- How many people they want in the group
    friends_invited TEXT[],     -- Array of emails/phones they invited during creation
    
    -- Tracks if we sent the specific "We have recorded your [Service] group" email
    group_notification_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for user_groups
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (as long as they provide a valid user_id they just created/fetched)
CREATE POLICY "Enable insert for anonymous users" ON public.user_groups
    FOR INSERT WITH CHECK (true);


-- ==========================================
-- LOGIC FLOW EXPLANATION (For your API/Backend)
-- ==========================================
/*
SCENARIO A: User simply joins the Waitlist (Waitlist Ticket Section)
1. UPSERT (Insert or Update) waitlist_users where email = 'user@example.com'.
   - Set joined_via_group_creation = FALSE (if it's a new row).
2. Check if welcome_email_sent is FALSE.
   - If FALSE: Send generic Waitlist Welcome Email -> Update welcome_email_sent = TRUE.
   - If TRUE: Do nothing (they already got it in the past).

SCENARIO B: User creates a Group (Create Group Modal)
1. UPSERT (Insert or Update) waitlist_users where email = 'user@example.com' returning id.
   - If it's a new user, you can optionally set joined_via_group_creation = TRUE 
     and welcome_email_sent = TRUE (to prevent the generic email from ever firing).
2. INSERT a new row into user_groups using the returned waitlist_user.id.
3. Send the "Group Created / We will notify you when ready" email.
   - Update group_notification_sent = TRUE for that specific user_groups row.
4. If they create a 2nd group later, Step 1 just fetches their ID without sending the generic email,
   and Step 2 & 3 repeat for the new group, sending them exactly what they expect for that specific new group!
*/
