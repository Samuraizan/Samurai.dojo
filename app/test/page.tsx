'use client'

import { useState, useEffect } from 'react'
import { deepseek } from '../ogsenpai/mind/llm/deepseek'
import { configManager } from '../ogsenpai/core/config'
import { OGSenpaiConfig } from '../ogsenpai/mind/personality/config'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  metadata?: {
    mood?: string
    wisdomLevel?: number
    strategicFocus?: number
  }
}

interface ConsciousnessMetrics {
  attention: {
    focus: string
    intensity: number
  }
  currentMood?: string
  wisdomLevel?: number
  strategicFocus?: number
}

interface MemoryStats {
  totalMemories: number
  knowledgeBaseEntries: number
}

export default function TestPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfigValid, setIsConfigValid] = useState(true)
  const [metrics, setMetrics] = useState<ConsciousnessMetrics>({
    attention: {
      focus: 'initialization',
      intensity: 0.5
    }
  })
  const [memoryStats, setMemoryStats] = useState<MemoryStats>({
    totalMemories: 0,
    knowledgeBaseEntries: 0
  })

  // Check configuration on mount
  useEffect(() => {
    const isValid = configManager.validateConfig()
    setIsConfigValid(isValid)
    
    if (!isValid) {
      setError('API key not configured. Please set DEEPSEEK_API_KEY in .env.local')
    }
    
    const greeting = OGSenpaiConfig.messagePatterns.greeting[
      Math.floor(Math.random() * OGSenpaiConfig.messagePatterns.greeting.length)
    ]
    
    setMessages([
      {
        role: 'assistant',
        content: isValid ? greeting : 'Configuration error: API key not found',
        timestamp: Date.now()
      }
    ])
  }, [])

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metrics updates
      setMetrics(prev => ({
        ...prev,
        attention: {
          focus: prev.attention.focus,
          intensity: Math.min(0.9, prev.attention.intensity + Math.random() * 0.1)
        }
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading || !isConfigValid) return

    const userMessage = input.trim()
    setInput('')
    setError('')
    setIsLoading(true)
    
    // Add user message to chat
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userChatMessage])

    try {
      const result = await deepseek.generateResponse({
        prompt: userMessage,
        model: configManager.getConfig().deepseek.defaultModel
      })

      // Simulate consciousness metrics
      const newMetrics = {
        mood: ['focused', 'analytical', 'contemplative'][Math.floor(Math.random() * 3)],
        wisdomLevel: Math.random(),
        strategicFocus: Math.random()
      }

      // Add assistant response to chat
      const assistantChatMessage: ChatMessage = {
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        metadata: newMetrics
      }
      setMessages(prev => [...prev, assistantChatMessage])

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        currentMood: newMetrics.mood,
        wisdomLevel: newMetrics.wisdomLevel,
        strategicFocus: newMetrics.strategicFocus
      }))

      // Simulate memory stats update
      setMemoryStats(prev => ({
        totalMemories: prev.totalMemories + 1,
        knowledgeBaseEntries: prev.knowledgeBaseEntries
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Metrics */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">OGSenpai Test Interface</h1>
            {!isConfigValid && (
              <div className="text-white text-sm">
                ⚠️ API Key not configured
              </div>
            )}
            <div className="text-sm text-white/60">
              <div>Total Memories: {memoryStats.totalMemories}</div>
              <div>Knowledge Base: {memoryStats.knowledgeBaseEntries}</div>
            </div>
          </div>
          
          {metrics && (
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-white/60">Attention Focus</h3>
                  <p className="text-lg">{metrics.attention.focus}</p>
                </div>
                <div>
                  <h3 className="text-sm text-white/60">Attention Intensity</h3>
                  <p className="text-lg">{(metrics.attention.intensity * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <h3 className="text-sm text-white/60">Current Mood</h3>
                  <p className="text-lg">{metrics.currentMood || 'neutral'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-white/60">Wisdom Level</h3>
                  <p className="text-lg">{metrics.wisdomLevel ? `${(metrics.wisdomLevel * 100).toFixed(0)}%` : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="bg-white/5 rounded-lg p-4 mb-4 h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div 
              key={`${msg.role}-${msg.timestamp}-${index}`}
              className={`mb-4 ${
                msg.role === 'user' ? 'text-white' : 'text-white/90'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">
                  {msg.role === 'user' ? 'You' : 'OGSenpai'}
                </span>
                <span className="text-xs text-white/40">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="pl-4 whitespace-pre-wrap">{msg.content}</div>
              {msg.metadata && (
                <div className="pl-4 mt-1 text-xs text-white/40">
                  {msg.metadata.mood && `Mood: ${msg.metadata.mood} • `}
                  {msg.metadata.wisdomLevel && `Wisdom: ${(msg.metadata.wisdomLevel * 100).toFixed(0)}% • `}
                  {msg.metadata.strategicFocus && `Strategy: ${(msg.metadata.strategicFocus * 100).toFixed(0)}%`}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-white/60 animate-pulse">
              OGSenpai is contemplating...
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-white/5 text-white rounded">
            <h2 className="font-bold">Error:</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConfigValid ? "Ask OGSenpai for guidance..." : "Please configure API key first"}
            disabled={isLoading || !isConfigValid}
            className="flex-1 bg-white/5 text-white px-4 py-2 rounded border border-white/10 focus:border-white/20 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !isConfigValid}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {/* Quick Test Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInput("Tell me about the way of Web3")}
            className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded text-sm"
          >
            Web3 Question
          </button>
          <button
            type="button"
            onClick={() => setInput("How do I handle failure?")}
            className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded text-sm"
          >
            Wisdom Question
          </button>
          <button
            type="button"
            onClick={() => setInput("What's your strategy for building communities?")}
            className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded text-sm"
          >
            Strategy Question
          </button>
        </div>
      </div>
    </div>
  )
} 