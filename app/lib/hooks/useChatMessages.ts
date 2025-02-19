import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type Message = Database['public']['Tables']['messages']['Row']

interface UseChatMessagesOptions {
  chatId: string
  limit?: number
}

export function useChatMessages({ chatId, limit = 50 }: UseChatMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Subscribe to real-time updates
  useSupabaseRealtime({
    table: 'messages',
    filter: {
      column: 'chat_id',
      value: chatId
    },
    onInsert: (newMessage) => {
      setMessages(prev => [newMessage, ...prev])
    },
    onUpdate: (updatedMessage) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      )
    },
    onDelete: (deletedMessage) => {
      setMessages(prev => 
        prev.filter(msg => msg.id !== deletedMessage.id)
      )
    }
  })

  // Initial fetch
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error

        setMessages(data)
        setHasMore(data.length === limit)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [chatId, limit])

  // Load more messages
  const loadMore = async () => {
    if (!hasMore || isLoading) return

    try {
      setIsLoading(true)
      const lastMessage = messages[messages.length - 1]

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .lt('created_at', lastMessage.created_at)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      setMessages(prev => [...prev, ...data])
      setHasMore(data.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more messages'))
    } finally {
      setIsLoading(false)
    }
  }

  // Send a new message
  const sendMessage = async (content: string, metadata: Record<string, unknown> = {}) => {
    try {
      const newMessage = {
        chat_id: chatId,
        content,
        metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'))
      throw err
    }
  }

  // Update a message
  const updateMessage = async (messageId: string, updates: Partial<Message>) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update message'))
      throw err
    }
  }

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete message'))
      throw err
    }
  }

  return {
    messages,
    isLoading,
    error,
    hasMore,
    loadMore,
    sendMessage,
    updateMessage,
    deleteMessage
  }
} 