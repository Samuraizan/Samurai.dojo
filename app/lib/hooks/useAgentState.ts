import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type Agent = Database['public']['Tables']['agents']['Row']

interface UseAgentStateOptions {
  agentId: string
  initialState?: Partial<Agent>
}

export function useAgentState({ agentId, initialState = {} }: UseAgentStateOptions) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Subscribe to real-time updates
  useSupabaseRealtime({
    table: 'agents',
    filter: {
      column: 'id',
      value: agentId
    },
    onUpdate: (updatedAgent) => {
      setAgent(updatedAgent)
    }
  })

  // Initial fetch
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .single()

        if (error) throw error

        setAgent(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agent'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgent()
  }, [agentId])

  // Update agent state
  const updateAgent = async (updates: Partial<Agent>) => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', agentId)
        .select()
        .single()

      if (error) throw error

      setAgent(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update agent'))
      throw err
    }
  }

  // Update agent status
  const updateStatus = (status: Agent['status']) => {
    return updateAgent({ status, updated_at: new Date().toISOString() })
  }

  // Update agent capabilities
  const updateCapabilities = (capabilities: Agent['capabilities']) => {
    return updateAgent({ capabilities, updated_at: new Date().toISOString() })
  }

  return {
    agent,
    isLoading,
    error,
    updateAgent,
    updateStatus,
    updateCapabilities
  }
} 