import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type Agent = Database['public']['Tables']['agents']['Row']
type AgentRelationship = Database['public']['Tables']['agent_relationships']['Row']

interface UseAgentRelationshipsOptions {
  agentId: string
}

interface RelatedAgent {
  agent: Agent
  relationship: AgentRelationship
}

export function useAgentRelationships({ agentId }: UseAgentRelationshipsOptions) {
  const [superiors, setSuperiors] = useState<RelatedAgent[]>([])
  const [subordinates, setSubordinates] = useState<RelatedAgent[]>([])
  const [peers, setPeers] = useState<RelatedAgent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Subscribe to real-time updates for relationships
  useSupabaseRealtime({
    table: 'agent_relationships',
    filter: {
      column: 'source_agent_id',
      value: agentId
    },
    onInsert: () => void fetchRelationships(),
    onUpdate: () => void fetchRelationships(),
    onDelete: () => void fetchRelationships()
  })

  // Fetch relationships
  const fetchRelationships = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch relationships where this agent is the source
      const { data: sourceRelationships, error: sourceError } = await supabase
        .from('agent_relationships')
        .select(`
          *,
          target:target_agent_id (*)
        `)
        .eq('source_agent_id', agentId)

      if (sourceError) throw sourceError

      // Fetch relationships where this agent is the target
      const { data: targetRelationships, error: targetError } = await supabase
        .from('agent_relationships')
        .select(`
          *,
          source:source_agent_id (*)
        `)
        .eq('target_agent_id', agentId)

      if (targetError) throw targetError

      // Process relationships
      const newSuperiors: RelatedAgent[] = []
      const newSubordinates: RelatedAgent[] = []
      const newPeers: RelatedAgent[] = []

      // Process relationships where this agent is the source
      for (const rel of sourceRelationships) {
        const relatedAgent = {
          agent: rel.target as Agent,
          relationship: rel
        }

        switch (rel.type) {
          case 'superior':
            newSuperiors.push(relatedAgent)
            break
          case 'subordinate':
            newSubordinates.push(relatedAgent)
            break
          case 'peer':
            newPeers.push(relatedAgent)
            break
        }
      }

      // Process relationships where this agent is the target
      for (const rel of targetRelationships) {
        const relatedAgent = {
          agent: rel.source as Agent,
          relationship: rel
        }

        switch (rel.type) {
          case 'superior':
            newSubordinates.push(relatedAgent)
            break
          case 'subordinate':
            newSuperiors.push(relatedAgent)
            break
          case 'peer':
            newPeers.push(relatedAgent)
            break
        }
      }

      setSuperiors(newSuperiors)
      setSubordinates(newSubordinates)
      setPeers(newPeers)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch relationships'))
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  // Initial fetch
  useEffect(() => {
    void fetchRelationships()
  }, [fetchRelationships])

  // Create a relationship
  const createRelationship = async (targetAgentId: string, type: AgentRelationship['type']) => {
    try {
      const { error } = await supabase
        .from('agent_relationships')
        .insert({
          source_agent_id: agentId,
          target_agent_id: targetAgentId,
          type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      await fetchRelationships()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create relationship'))
      throw err
    }
  }

  // Update a relationship
  const updateRelationship = async (relationshipId: string, type: AgentRelationship['type']) => {
    try {
      const { error } = await supabase
        .from('agent_relationships')
        .update({
          type,
          updated_at: new Date().toISOString()
        })
        .eq('id', relationshipId)

      if (error) throw error

      await fetchRelationships()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update relationship'))
      throw err
    }
  }

  // Delete a relationship
  const deleteRelationship = async (relationshipId: string) => {
    try {
      const { error } = await supabase
        .from('agent_relationships')
        .delete()
        .eq('id', relationshipId)

      if (error) throw error

      await fetchRelationships()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete relationship'))
      throw err
    }
  }

  // Get all related agents
  const getAllRelatedAgents = () => {
    return [...superiors, ...subordinates, ...peers]
  }

  // Check if an agent is related
  const isRelated = (targetAgentId: string) => {
    return getAllRelatedAgents().some(related => related.agent.id === targetAgentId)
  }

  // Get relationship type with another agent
  const getRelationshipType = (targetAgentId: string) => {
    const superior = superiors.find(rel => rel.agent.id === targetAgentId)
    if (superior) return 'superior'

    const subordinate = subordinates.find(rel => rel.agent.id === targetAgentId)
    if (subordinate) return 'subordinate'

    const peer = peers.find(rel => rel.agent.id === targetAgentId)
    if (peer) return 'peer'

    return null
  }

  return {
    superiors,
    subordinates,
    peers,
    isLoading,
    error,
    createRelationship,
    updateRelationship,
    deleteRelationship,
    getAllRelatedAgents,
    isRelated,
    getRelationshipType
  }
} 