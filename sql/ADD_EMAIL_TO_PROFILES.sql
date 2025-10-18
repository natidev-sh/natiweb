-- Option 1: Add email column to profiles (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
    
    -- Sync emails from auth.users
    UPDATE public.profiles p
    SET email = au.email
    FROM auth.users au
    WHERE p.id = au.id;
    
    RAISE NOTICE 'Added email column to profiles';
  ELSE
    RAISE NOTICE 'Email column already exists';
  END IF;
END $$;

-- Verify
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'email';
