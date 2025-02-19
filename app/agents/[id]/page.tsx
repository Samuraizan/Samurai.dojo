'use client'

import { useParams } from 'next/navigation'
import { memo, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { sendMessage, type ChatMessage } from '@/lib/services/chat'
import { getAgentSkills, type AgentSkill } from '@/lib/services/agent-status'
import ChatThreads from '@/components/chat/ChatThreads'
import { supabase } from '@/lib/supabase/client'

// Memoized components for performance
const AgentStatus = memo(function AgentStatus() {
  const [skills, setSkills] = useState<AgentSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSkills() {
      try {
        const agentSkills = await getAgentSkills('ogsenpai')
        setSkills(agentSkills)
      } catch (error) {
        console.error('Failed to load skills:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSkills()
  }, [])

  return (
    <div className="p-4 border-b border-white/10">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/70">status</span>
        <span className="text-xs text-green-400/70">active</span>
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-white/70 mb-2">skills</h3>
        <div className="space-y-2">
          {loading ? (
            <div className="text-xs text-white/50">loading skills...</div>
          ) : (
            skills.map(skill => (
              <div key={skill.name} className="flex justify-between items-center group">
                <span className="text-xs text-white/50">{skill.name}</span>
                <span className={`text-xs ${
                  skill.status === 'active' ? 'text-green-400/70' :
                  skill.status === 'error' ? 'text-red-400/70' :
                  'text-gray-400/70'
                }`}>
                  {skill.status}
                </span>
                {skill.error && (
                  <div className="hidden group-hover:block absolute right-0 mt-6 p-2 bg-black/90 border border-white/10 rounded text-xs text-white/70">
                    {skill.error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
})

const MessageBubble = memo(function MessageBubble({ role, content }: { role: string, content: string }) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] px-4 py-2 rounded ${
        role === 'user' ? 'bg-white/5' : 'bg-white/10'
      }`}>
        <div className="text-xs text-white/50 mb-1">{role === 'user' ? 'you' : 'ogsenpai'}</div>
        <div className="text-sm text-white/90">{content}</div>
      </div>
    </div>
  )
})

const ChatModule = memo(function ChatModule({ threadId }: { threadId: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load messages when thread changes
    if (threadId) {
      const loadMessages = async () => {
        try {
          const { data, error } = await supabase
            .from('chats')
            .select('messages')
            .eq('id', threadId)
            .single()

          if (error) throw error
          setMessages(data.messages || [])
        } catch (error) {
          console.error('Failed to load messages:', error)
        }
      }
      loadMessages()
    } else {
      setMessages([])
    }
  }, [threadId])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !threadId) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message immediately
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    const updatedMessages = [...messages, newUserMessage]
    setMessages(updatedMessages)

    try {
      // Update thread with new message
      await supabase
        .from('chats')
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        })
        .eq('id', threadId)

      // Send message to get AI response
      const response = await sendMessage(userMessage)
      if (response.message) {
        const messagesWithResponse = [...updatedMessages, response.message]
        setMessages(messagesWithResponse)
        // Update thread with AI response
        await supabase
          .from('chats')
          .update({
            messages: messagesWithResponse,
            updated_at: new Date().toISOString()
          })
          .eq('id', threadId)
      }
      if (response.error) {
        console.error('Chat error:', response.error)
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, threadId])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        {messages.map(message => (
          <MessageBubble key={message.id} role={message.role} content={message.content} />
        ))}
        {isLoading && (
          <div className="text-sm text-white/50 text-center">processing...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={threadId ? "Send a message..." : "Select a chat to start messaging"}
          className="w-full bg-black border border-white/10 rounded px-4 py-2 text-sm text-white/90 focus:outline-none focus:border-white/20"
          disabled={isLoading || !threadId}
        />
      </form>
    </div>
  )
})

export default function AgentDashboard() {
  const params = useParams()
  const agentId = params.id as string
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <Link href="/agents" className="text-sm text-white/50 hover:text-white">←</Link>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/70">status</span>
            <span className="text-xs text-green-400/70">active</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/70">skills</span>
            <span className="text-xs text-white/50">deepseek chat</span>
            <span className="text-xs text-green-400/70">active</span>
          </div>
          <span className="text-sm text-white/50">ogsenpai</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-12 h-[calc(100vh-113px)]">
        {/* Chat Threads - Left */}
        <div className="col-span-3 border-r border-white/10">
          <ChatThreads
            agentId={agentId}
            currentThreadId={currentThreadId}
            onSelectThread={setCurrentThreadId}
          />
        </div>
        
        {/* Chat Area - Right */}
        <div className="col-span-9">
          <div className="h-full flex flex-col">
            <ChatModule threadId={currentThreadId} />
          </div>
        </div>
      </div>
    </div>
  )
} 