-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Memory Types enum
CREATE TYPE memory_type AS ENUM (
  'working',      -- Short-term active memory
  'episodic',     -- Experience-based memories
  'semantic'      -- Knowledge and facts
);

-- Memory importance enum
CREATE TYPE memory_importance AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Base memories table
CREATE TABLE IF NOT EXISTS "public"."memories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "type" memory_type NOT NULL,
  "agent_id" UUID REFERENCES public.agents(id),
  "content" JSONB NOT NULL,
  "importance" memory_importance NOT NULL DEFAULT 'medium',
  "embedding" vector(1536),
  "metadata" JSONB,
  "expires_at" TIMESTAMPTZ,
  "access_count" INTEGER NOT NULL DEFAULT 0,
  "last_accessed" TIMESTAMPTZ
);

-- Working memory table (short-term)
CREATE TABLE IF NOT EXISTS "public"."working_memory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "memory_id" UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  "context" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Episodic memory table (experiences)
CREATE TABLE IF NOT EXISTS "public"."episodic_memory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "memory_id" UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  "timestamp" TIMESTAMPTZ NOT NULL,
  "location" TEXT,
  "participants" TEXT[],
  "emotions" TEXT[],
  "tags" TEXT[],
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Semantic memory table (knowledge)
CREATE TABLE IF NOT EXISTS "public"."semantic_memory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "memory_id" UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  "category" TEXT NOT NULL,
  "subcategory" TEXT,
  "confidence" FLOAT NOT NULL DEFAULT 1.0,
  "source" TEXT,
  "tags" TEXT[],
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Memory associations table
CREATE TABLE IF NOT EXISTS "public"."memory_associations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "source_memory_id" UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  "target_memory_id" UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  "association_type" TEXT NOT NULL,
  "strength" FLOAT NOT NULL DEFAULT 1.0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_memory_id, target_memory_id, association_type)
);

-- Memory access log
CREATE TABLE IF NOT EXISTS "public"."memory_access_log" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "memory_id" UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  "agent_id" UUID REFERENCES public.agents(id),
  "access_type" TEXT NOT NULL,
  "context" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_memories_type ON public.memories(type);
CREATE INDEX idx_memories_agent_id ON public.memories(agent_id);
CREATE INDEX idx_memories_importance ON public.memories(importance);
CREATE INDEX idx_working_memory_active ON public.working_memory(active);
CREATE INDEX idx_episodic_memory_timestamp ON public.episodic_memory(timestamp);
CREATE INDEX idx_semantic_memory_category ON public.semantic_memory(category);
CREATE INDEX idx_memory_associations_source ON public.memory_associations(source_memory_id);
CREATE INDEX idx_memory_associations_target ON public.memory_associations(target_memory_id);

-- Full text search indexes
CREATE INDEX idx_memories_content_gin ON public.memories USING gin ((content::text) gin_trgm_ops);
CREATE INDEX idx_working_memory_context_gin ON public.working_memory USING gin (context gin_trgm_ops);
CREATE INDEX idx_episodic_memory_tags_gin ON public.episodic_memory USING gin (tags);
CREATE INDEX idx_semantic_memory_tags_gin ON public.semantic_memory USING gin (tags);

-- Vector similarity search index
CREATE INDEX idx_memories_embedding ON public.memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.handle_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER handle_memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_memory_updated_at();

CREATE TRIGGER handle_working_memory_updated_at
  BEFORE UPDATE ON public.working_memory
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_memory_updated_at();

CREATE TRIGGER handle_episodic_memory_updated_at
  BEFORE UPDATE ON public.episodic_memory
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_memory_updated_at();

CREATE TRIGGER handle_semantic_memory_updated_at
  BEFORE UPDATE ON public.semantic_memory
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_memory_updated_at();

CREATE TRIGGER handle_memory_associations_updated_at
  BEFORE UPDATE ON public.memory_associations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_memory_updated_at();

-- Memory cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_memories()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete expired memories
  DELETE FROM public.memories
  WHERE expires_at < NOW();
  
  -- Archive old working memories
  UPDATE public.memories
  SET type = 'episodic'
  WHERE type = 'working'
    AND updated_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- RLS Policies
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodic_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semantic_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_access_log ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to memories"
  ON public.memories FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to working memory"
  ON public.working_memory FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to episodic memory"
  ON public.episodic_memory FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to semantic memory"
  ON public.semantic_memory FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to memory associations"
  ON public.memory_associations FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to memory access log"
  ON public.memory_access_log FOR SELECT
  USING (true);

-- Allow agents to modify their own memories
CREATE POLICY "Allow agents to modify their memories"
  ON public.memories FOR ALL
  USING (agent_id = auth.uid())
  WITH CHECK (agent_id = auth.uid());

-- Create memory management functions
CREATE OR REPLACE FUNCTION create_memory(
  p_type memory_type,
  p_agent_id UUID,
  p_content JSONB,
  p_importance memory_importance DEFAULT 'medium',
  p_metadata JSONB DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_memory_id UUID;
BEGIN
  INSERT INTO public.memories (
    type,
    agent_id,
    content,
    importance,
    metadata,
    expires_at
  )
  VALUES (
    p_type,
    p_agent_id,
    p_content,
    p_importance,
    p_metadata,
    p_expires_at
  )
  RETURNING id INTO v_memory_id;
  
  RETURN v_memory_id;
END;
$$; 