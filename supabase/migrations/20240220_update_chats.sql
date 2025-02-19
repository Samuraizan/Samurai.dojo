-- Update chats table with missing fields
ALTER TABLE public.chats
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'temp-user',
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Create updated_at trigger for chats
CREATE TRIGGER handle_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for chats
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;

-- Update RLS policies for chats
DROP POLICY IF EXISTS "Allow public read access to chats" ON public.chats;
DROP POLICY IF EXISTS "Allow public insert to chats" ON public.chats;

CREATE POLICY "Enable read access for all users"
    ON public.chats FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.chats FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for users on their chats"
    ON public.chats FOR UPDATE
    USING (true);

CREATE POLICY "Enable delete for users on their chats"
    ON public.chats FOR DELETE
    USING (true); 