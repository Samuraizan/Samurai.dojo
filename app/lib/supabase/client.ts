import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

// Save chat message
export async function saveChatMessage(agentId: string, message: { role: string, content: string }) {
  const { data, error } = await supabase
    .from('chats')
    .insert({
      agent_id: agentId,
      messages: [message],
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get chat history
export async function getChatHistory(agentId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('messages')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data?.flatMap(chat => chat.messages) ?? []
} 