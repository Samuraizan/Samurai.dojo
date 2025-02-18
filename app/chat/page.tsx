'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { deepseek } from '../ogsenpai/mind/llm/deepseek'
import { selfAwareness } from '../ogsenpai/mind/consciousness/self-awareness'

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

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    attention: 0.85,
    wisdom: 0.92,
    strategy: 0.88,
    load: 0.15
  })
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
    const interval = setInterval(updateMetrics, 5000)
    return () => clearInterval(interval)
  }, [messages])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = e.clientX
    if (newWidth >= 200 && newWidth <= 600) {
      setSidebarWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const updateMetrics = async () => {
    try {
      const capabilities = await selfAwareness.getCapabilitiesSummary()
      const systemState = await selfAwareness.getSystemState()
      
      // Update metrics based on self-awareness data
      setSystemMetrics(prev => ({
        ...prev,
        attention: Math.random() * 0.3 + 0.7, // Simulated for now
        wisdom: Math.random() * 0.2 + 0.8,    // Simulated for now
        strategy: Math.random() * 0.2 + 0.8,  // Simulated for now
        load: Math.random() * 0.3             // Simulated for now
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
    
    // Add user message
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userChatMessage])

    try {
      let response: string

      // Check if the message is asking about system capabilities or state
      if (userMessage.toLowerCase().includes('capabilities') || 
          userMessage.toLowerCase().includes('what can you do')) {
        response = await selfAwareness.getCapabilitiesSummary()
      } else if (userMessage.toLowerCase().includes('system state') || 
                userMessage.toLowerCase().includes('status')) {
        response = await selfAwareness.getSystemState()
      } else {
        // Regular chat processing
        const result = await deepseek.generateResponse({
          prompt: userMessage,
          model: 'deepseek-chat'
        })
        response = result.text
      }

      // Add assistant response
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

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div 
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 border-r border-white/10 p-4 flex flex-col relative"
      >
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-white/20 transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />
        
        <Link href="/dashboard" className="mb-8 text-sm hover:text-white/80">
          Return to Command Center
        </Link>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-gray-400">System Metrics</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-400">Attention</h3>
                <p className="text-lg">{(systemMetrics.attention * 100).toFixed(0)}%</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">System Load</h3>
                <p className="text-lg">{(systemMetrics.load * 100).toFixed(0)}%</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Wisdom Level</h3>
                <p className="text-lg">{(systemMetrics.wisdom * 100).toFixed(0)}%</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Strategic Focus</h3>
                <p className="text-lg">{(systemMetrics.strategy * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.role === 'assistant'
                  ? 'bg-white/5'
                  : 'bg-white/10'
              } p-4 rounded-lg`}
            >
              <div className="text-sm text-gray-400 mb-1">
                {message.role === 'assistant' ? 'OGSenpai' : 'You'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="bg-white/5 p-4 rounded-lg animate-pulse">
              <div className="text-sm text-gray-400 mb-1">OGSenpai</div>
              <div>Processing...</div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              EXECUTE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 