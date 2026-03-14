-- ==========================================
-- FIX: AUTO-CREATE PROFILES FOR NEW USERS
-- ==========================================

-- 1. Create a function that automatically inserts a row into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the function to a trigger on the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- FIX: BACKFILL EXISTING USERS
-- ==========================================

-- 3. Insert profiles for any existing users that don't have one yet
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
