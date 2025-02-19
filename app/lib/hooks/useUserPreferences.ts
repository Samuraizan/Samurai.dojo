import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

interface UseUserPreferencesOptions {
  userId: string
}

export function useUserPreferences({ userId }: UseUserPreferencesOptions) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Subscribe to real-time updates
  useSupabaseRealtime({
    table: 'user_preferences',
    filter: {
      column: 'user_id',
      value: userId
    },
    onUpdate: (updatedPreferences) => {
      setPreferences(updatedPreferences)
    }
  })

  // Initial fetch
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No preferences found, create default preferences
            const defaultPreferences = {
              user_id: userId,
              theme: 'dark',
              notifications_enabled: true,
              chat_settings: {
                message_display: 'modern',
                show_timestamps: true,
                show_avatars: true
              },
              agent_settings: {
                default_view: 'grid',
                show_status: true,
                show_capabilities: true
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }

            const { data: newData, error: createError } = await supabase
              .from('user_preferences')
              .insert(defaultPreferences)
              .select()
              .single()

            if (createError) throw createError
            setPreferences(newData)
          } else {
            throw error
          }
        } else {
          setPreferences(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch preferences'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreferences()
  }, [userId])

  // Update preferences
  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      setPreferences(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'))
      throw err
    }
  }

  // Update theme
  const updateTheme = (theme: UserPreferences['theme']) => {
    return updatePreferences({ theme })
  }

  // Update notifications
  const updateNotifications = (enabled: boolean) => {
    return updatePreferences({ notifications_enabled: enabled })
  }

  // Update chat settings
  const updateChatSettings = (settings: Partial<UserPreferences['chat_settings']>) => {
    if (!preferences?.chat_settings) return
    return updatePreferences({
      chat_settings: { ...preferences.chat_settings, ...settings }
    })
  }

  // Update agent settings
  const updateAgentSettings = (settings: Partial<UserPreferences['agent_settings']>) => {
    if (!preferences?.agent_settings) return
    return updatePreferences({
      agent_settings: { ...preferences.agent_settings, ...settings }
    })
  }

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    updateTheme,
    updateNotifications,
    updateChatSettings,
    updateAgentSettings
  }
} 