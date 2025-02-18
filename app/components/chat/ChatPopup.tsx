'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { deepseek } from '../../ogsenpai/mind/llm/deepseek'
import { selfAwareness } from '../../ogsenpai/mind/consciousness/self-awareness'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface SystemMetrics {
  attention: number
  wisdom: number
  strategy: number
  load: number
}

interface ChatPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    attention: 0.85,
    wisdom: 0.92,
    strategy: 0.88,
    load: 0.15
  })
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      scrollToBottom()
    }
    const interval = setInterval(updateMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const updateMetrics = async () => {
    try {
      const capabilities = await selfAwareness.getCapabilitiesSummary()
      const systemState = await selfAwareness.getSystemState()
      
      setSystemMetrics(prev => ({
        ...prev,
        attention: Math.random() * 0.3 + 0.7,
        wisdom: Math.random() * 0.2 + 0.8,
        strategy: Math.random() * 0.2 + 0.8,
        load: Math.random() * 0.3
      }))
    } catch (error) {
      console.error('Error updating metrics:', error)
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)
    
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userChatMessage])

    try {
      let response: string

      if (userMessage.toLowerCase().includes('capabilities') || 
          userMessage.toLowerCase().includes('what can you do')) {
        response = await selfAwareness.getCapabilitiesSummary()
      } else if (userMessage.toLowerCase().includes('system state') || 
                userMessage.toLowerCase().includes('status')) {
        response = await selfAwareness.getSystemState()
      } else {
        const result = await deepseek.generateResponse({
          prompt: userMessage,
          model: 'deepseek-chat'
        })
        response = result.text
      }

      const assistantChatMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, assistantChatMessage])
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-black border border-white/10 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="font-bold">OGSenpai Terminal</h2>
          <div className="text-xs text-white/60">Direct Communication Channel</div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/chat"
            className="p-2 hover:bg-white/10 rounded"
            title="Open in full screen"
            aria-label="Open chat in full screen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/>
            </svg>
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded"
            title="Close chat"
            type="button"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="px-4 py-2 border-b border-white/10 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-white/60">Attention</div>
          <div>{(systemMetrics.attention * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-white/60">System Load</div>
          <div>{(systemMetrics.load * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, i) => (
          <div
            key={`${message.role}-${message.timestamp}-${i}`}
            className={`${
              message.role === 'assistant'
                ? 'bg-white/5'
                : 'bg-white/10'
            } p-4 rounded-lg`}
          >
            <div className="text-sm text-white/60 mb-1">
              {message.role === 'assistant' ? 'OGSenpai' : 'You'}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-white/5 p-4 rounded-lg animate-pulse">
            <div className="text-sm text-white/60 mb-1">OGSenpai</div>
            <div>Processing...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
            className="flex-1 bg-white/5 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            EXECUTE
          </button>
        </div>
      </form>
    </div>
  )
} 