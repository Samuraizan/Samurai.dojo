-- Function to match memories by vector similarity
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  type memory_type,
  agent_id uuid,
  content jsonb,
  importance memory_importance,
  embedding vector(1536),
  metadata jsonb,
  expires_at timestamptz,
  access_count int,
  last_accessed timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.*,
    1 - (m.embedding <=> query_embedding) as similarity
  FROM memories m
  WHERE m.embedding IS NOT NULL
    AND 1 - (m.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Function to update memory access count and timestamp
CREATE OR REPLACE FUNCTION update_memory_access(p_memory_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE memories
  SET 
    access_count = access_count + 1,
    last_accessed = NOW()
  WHERE id = p_memory_id;
END;
$$;

-- Function to find related memories through associations
CREATE OR REPLACE FUNCTION find_related_memories(
  source_memory_id uuid,
  max_depth int DEFAULT 2,
  min_strength float DEFAULT 0.5
)
RETURNS TABLE (
  memory_id uuid,
  path_strength float,
  depth int
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY WITH RECURSIVE
    memory_tree AS (
      -- Base case: direct associations
      SELECT 
        CASE 
          WHEN source_memory_id = source_memory_id THEN target_memory_id
          ELSE source_memory_id
        END as memory_id,
        strength as path_strength,
        1 as depth
      FROM memory_associations
      WHERE (source_memory_id = source_memory_id OR target_memory_id = source_memory_id)
        AND strength >= min_strength
      
      UNION
      
      -- Recursive case: follow associations
      SELECT
        CASE 
          WHEN ma.source_memory_id = mt.memory_id THEN ma.target_memory_id
          ELSE ma.source_memory_id
        END as memory_id,
        mt.path_strength * ma.strength as path_strength,
        mt.depth + 1 as depth
      FROM memory_tree mt
      JOIN memory_associations ma ON 
        (ma.source_memory_id = mt.memory_id OR ma.target_memory_id = mt.memory_id)
      WHERE mt.depth < max_depth
        AND mt.path_strength * ma.strength >= min_strength
    )
    SELECT DISTINCT ON (memory_id)
      memory_id,
      path_strength,
      depth
    FROM memory_tree
    WHERE memory_id != source_memory_id
    ORDER BY memory_id, path_strength DESC;
END;
$$;

-- Function to cleanup and archive memories
CREATE OR REPLACE FUNCTION cleanup_and_archive_memories(
  archive_age interval DEFAULT '30 days'::interval,
  delete_age interval DEFAULT '90 days'::interval
)
RETURNS TABLE (
  archived_count int,
  deleted_count int
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_archived_count int;
  v_deleted_count int;
BEGIN
  -- Archive old working memories
  WITH archived AS (
    UPDATE memories
    SET type = 'episodic'
    WHERE type = 'working'
      AND updated_at < NOW() - archive_age
      AND (expires_at IS NULL OR expires_at > NOW())
    RETURNING id
  )
  SELECT COUNT(*) INTO v_archived_count
  FROM archived;

  -- Delete expired and old memories
  WITH deleted AS (
    DELETE FROM memories
    WHERE expires_at < NOW()
      OR (type != 'semantic' AND updated_at < NOW() - delete_age)
    RETURNING id
  )
  SELECT COUNT(*) INTO v_deleted_count
  FROM deleted;

  RETURN QUERY
  SELECT v_archived_count, v_deleted_count;
END;
$$;

-- Function to merge similar memories
CREATE OR REPLACE FUNCTION merge_similar_memories(
  similarity_threshold float DEFAULT 0.95,
  batch_size int DEFAULT 100
)
RETURNS TABLE (
  merged_count int,
  source_ids uuid[],
  target_ids uuid[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_merged_count int := 0;
  v_source_ids uuid[] := '{}';
  v_target_ids uuid[] := '{}';
BEGIN
  -- Find and merge similar memories
  WITH similar_pairs AS (
    SELECT 
      m1.id as source_id,
      m2.id as target_id,
      1 - (m1.embedding <=> m2.embedding) as similarity
    FROM memories m1
    JOIN memories m2 ON m1.id < m2.id  -- Avoid self-joins and duplicates
    WHERE m1.embedding IS NOT NULL 
      AND m2.embedding IS NOT NULL
      AND m1.type = m2.type
      AND 1 - (m1.embedding <=> m2.embedding) > similarity_threshold
    ORDER BY similarity DESC
    LIMIT batch_size
  ),
  merged AS (
    INSERT INTO memory_associations (
      source_memory_id,
      target_memory_id,
      association_type,
      strength
    )
    SELECT
      source_id,
      target_id,
      'merged',
      similarity
    FROM similar_pairs
    RETURNING source_memory_id, target_memory_id
  )
  SELECT 
    COUNT(*),
    ARRAY_AGG(source_memory_id),
    ARRAY_AGG(target_memory_id)
  INTO 
    v_merged_count,
    v_source_ids,
    v_target_ids
  FROM merged;

  RETURN QUERY
  SELECT v_merged_count, v_source_ids, v_target_ids;
END;
$$; 