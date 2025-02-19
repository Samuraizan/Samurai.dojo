import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type Agent = Database['public']['Tables']['agents']['Row']

interface UseAgentSettingsOptions {
  agentId: string
}

interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  stopSequences: string[]
  systemPrompt: string
  capabilities: {
    [key: string]: {
      enabled: boolean
      config: Record<string, unknown>
    }
  }
}

const defaultConfig: AgentConfig = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: [],
  systemPrompt: 'You are a helpful AI assistant.',
  capabilities: {}
}

export function useAgentSettings({ agentId }: UseAgentSettingsOptions) {
  const [config, setConfig] = useState<AgentConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Subscribe to real-time updates
  useSupabaseRealtime({
    table: 'agents',
    filter: {
      column: 'id',
      value: agentId
    },
    onUpdate: (agent) => {
      if (agent.config) {
        setConfig(agent.config as AgentConfig)
        setIsDirty(false)
      }
    }
  })

  // Initial fetch
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('config')
          .eq('id', agentId)
          .single()

        if (error) throw error

        if (data.config) {
          setConfig(data.config as AgentConfig)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agent config'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [agentId])

  // Update config
  const updateConfig = async (updates: Partial<AgentConfig>) => {
    try {
      const newConfig = { ...config, ...updates }
      
      const { error } = await supabase
        .from('agents')
        .update({
          config: newConfig,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId)

      if (error) throw error

      setConfig(newConfig)
      setIsDirty(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update agent config'))
      throw err
    }
  }

  // Update model settings
  const updateModelSettings = async (settings: Partial<Pick<AgentConfig, 'model' | 'temperature' | 'maxTokens' | 'topP' | 'frequencyPenalty' | 'presencePenalty'>>) => {
    setIsDirty(true)
    return updateConfig(settings)
  }

  // Update system prompt
  const updateSystemPrompt = async (systemPrompt: string) => {
    setIsDirty(true)
    return updateConfig({ systemPrompt })
  }

  // Update stop sequences
  const updateStopSequences = async (stopSequences: string[]) => {
    setIsDirty(true)
    return updateConfig({ stopSequences })
  }

  // Enable/disable capability
  const toggleCapability = async (capability: string, enabled: boolean) => {
    setIsDirty(true)
    const capabilities = { ...config.capabilities }
    if (!capabilities[capability]) {
      capabilities[capability] = {
        enabled,
        config: {}
      }
    } else {
      capabilities[capability].enabled = enabled
    }
    return updateConfig({ capabilities })
  }

  // Update capability config
  const updateCapabilityConfig = async (capability: string, settings: Record<string, unknown>) => {
    setIsDirty(true)
    const capabilities = { ...config.capabilities }
    if (!capabilities[capability]) {
      capabilities[capability] = {
        enabled: true,
        config: settings
      }
    } else {
      capabilities[capability].config = {
        ...capabilities[capability].config,
        ...settings
      }
    }
    return updateConfig({ capabilities })
  }

  // Reset config to defaults
  const resetConfig = async () => {
    setIsDirty(true)
    return updateConfig(defaultConfig)
  }

  return {
    config,
    isLoading,
    error,
    isDirty,
    updateModelSettings,
    updateSystemPrompt,
    updateStopSequences,
    toggleCapability,
    updateCapabilityConfig,
    resetConfig
  }
} 