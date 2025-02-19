import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type ChatThread = Database['public']['Tables']['chats']['Row']
type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export async function getChatThreads(agentId: string): Promise<ChatThread[]> {
  try {
    console.log('Fetching threads for agent:', agentId)
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      if (error.code === 'PGRST204') {
        // Table doesn't exist yet, return empty array
        return []
      }
      throw error
    }

    console.log('Fetched threads:', data)
    return data || []
  } catch (err) {
    console.error('Error in getChatThreads:', err)
    return [] // Return empty array instead of throwing to prevent UI errors
  }
}

export async function createChatThread(agentId: string, title = 'New Chat'): Promise<ChatThread> {
  try {
    console.log('Creating thread for agent:', agentId)
    const { data, error } = await supabase
      .from('chats')
      .insert({
        agent_id: agentId,
        user_id: 'temp-user',
        title,
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Created thread:', data)
    return data
  } catch (err) {
    console.error('Error in createChatThread:', err)
    throw new Error('Failed to create chat thread')
  }
}

export async function updateChatThread(threadId: string, messages: ChatMessage[]): Promise<ChatThread> {
  try {
    console.log('Updating thread:', threadId)
    const { data, error } = await supabase
      .from('chats')
      .update({
        messages,
        updated_at: new Date().toISOString()
      })
      .eq('id', threadId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Updated thread:', data)
    return data
  } catch (err) {
    console.error('Error in updateChatThread:', err)
    throw new Error('Failed to update chat thread')
  }
}

export async function deleteChatThread(threadId: string): Promise<void> {
  try {
    console.log('Deleting thread:', threadId)
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', threadId)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Deleted thread:', threadId)
  } catch (err) {
    console.error('Error in deleteChatThread:', err)
    throw new Error('Failed to delete chat thread')
  }
}

export async function updateChatThreadTitle(threadId: string, title: string): Promise<ChatThread> {
  try {
    console.log('Updating thread title:', threadId, title)
    const { data, error } = await supabase
      .from('chats')
      .update({
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', threadId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Updated thread title:', data)
    return data
  } catch (err) {
    console.error('Error in updateChatThreadTitle:', err)
    throw new Error('Failed to update chat title')
  }
} 