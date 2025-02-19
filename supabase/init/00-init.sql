-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create agents table
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Create chats table
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    messages JSONB[] NOT NULL DEFAULT '{}'
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger for agents
CREATE TRIGGER handle_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Set up RLS policies
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to agents"
    ON public.agents FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to chats"
    ON public.chats FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to chats"
    ON public.chats FOR INSERT
    WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_chats_agent_id ON public.chats(agent_id);

-- Insert default agents
INSERT INTO public.agents (id, name, role, description, image_url) VALUES
    ('00000000-0000-0000-0000-000000000001', 'OG Senpai', 'chief', 'Master AI with command authority over all agents', '/agents/ogsenpai.png'),
    ('00000000-0000-0000-0000-000000000002', 'Eliza', 'agent', 'Social engagement and community management powered by ElizaOS', '/agents/eliza.png'); 