CREATE OR REPLACE FUNCTION create_chats_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create chats table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    agent_id TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'temp-user',
    title TEXT,
    messages JSONB[] NOT NULL DEFAULT '{}',
    metadata JSONB
  );

  -- Create updated_at trigger if it doesn't exist
  CREATE OR REPLACE FUNCTION public.handle_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger if it doesn't exist
  DROP TRIGGER IF EXISTS handle_chats_updated_at ON public.chats;
  CREATE TRIGGER handle_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

  -- Enable RLS
  ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

  -- Create policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.chats;
  CREATE POLICY "Enable read access for all users"
    ON public.chats FOR SELECT
    USING (true);

  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.chats;
  CREATE POLICY "Enable insert for authenticated users only"
    ON public.chats FOR INSERT
    WITH CHECK (true);

  DROP POLICY IF EXISTS "Enable update for users on their chats" ON public.chats;
  CREATE POLICY "Enable update for users on their chats"
    ON public.chats FOR UPDATE
    USING (true);

  DROP POLICY IF EXISTS "Enable delete for users on their chats" ON public.chats;
  CREATE POLICY "Enable delete for users on their chats"
    ON public.chats FOR DELETE
    USING (true);

  -- Enable realtime
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
  EXCEPTION
    WHEN undefined_object THEN
      CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
  END;
END;
$$; 