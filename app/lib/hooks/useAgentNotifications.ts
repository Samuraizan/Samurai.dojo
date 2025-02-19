import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type Notification = Database['public']['Tables']['agent_notifications']['Row']

interface UseAgentNotificationsOptions {
  agentId: string
  limit?: number
}

export function useAgentNotifications({ agentId, limit = 50 }: UseAgentNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Subscribe to real-time updates
  useSupabaseRealtime({
    table: 'agent_notifications',
    filter: {
      column: 'agent_id',
      value: agentId
    },
    onInsert: (newNotification) => {
      setNotifications(prev => [newNotification, ...prev])
      if (!newNotification.read) {
        setUnreadCount(prev => prev + 1)
      }
    },
    onUpdate: (updatedNotification) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === updatedNotification.id ? updatedNotification : notification
        )
      )
      // Update unread count
      void fetchUnreadCount()
    },
    onDelete: (deletedNotification) => {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== deletedNotification.id)
      )
      if (!deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  })

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('agent_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', agentId)
        .eq('read', false)

      if (error) throw error

      setUnreadCount(count ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch unread count'))
    }
  }, [agentId])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('agent_notifications')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      setNotifications(data)
      setHasMore(data.length === limit)
      await fetchUnreadCount()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'))
    } finally {
      setIsLoading(false)
    }
  }, [agentId, limit, fetchUnreadCount])

  // Initial fetch
  useEffect(() => {
    void fetchNotifications()
  }, [fetchNotifications])

  // Load more notifications
  const loadMore = async () => {
    if (!hasMore || isLoading) return

    try {
      setIsLoading(true)
      const lastNotification = notifications[notifications.length - 1]

      const { data, error } = await supabase
        .from('agent_notifications')
        .select('*')
        .eq('agent_id', agentId)
        .lt('created_at', lastNotification.created_at)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      setNotifications(prev => [...prev, ...data])
      setHasMore(data.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more notifications'))
    } finally {
      setIsLoading(false)
    }
  }

  // Create a notification
  const createNotification = async (
    type: string,
    title: string,
    message: string,
    metadata: Record<string, unknown> = {}
  ) => {
    try {
      const { data, error } = await supabase
        .from('agent_notifications')
        .insert({
          agent_id: agentId,
          type,
          title,
          message,
          metadata,
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create notification'))
      throw err
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('agent_notifications')
        .update({
          read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark notification as read'))
      throw err
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('agent_notifications')
        .update({
          read: true,
          updated_at: new Date().toISOString()
        })
        .eq('agent_id', agentId)
        .eq('read', false)

      if (error) throw error

      setUnreadCount(0)
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark all notifications as read'))
      throw err
    }
  }

  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('agent_notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete notification'))
      throw err
    }
  }

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('agent_notifications')
        .delete()
        .eq('agent_id', agentId)

      if (error) throw error

      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear notifications'))
      throw err
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    loadMore,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  }
} 