'use client'

import { useState, useEffect } from 'react'
import { getAllAgents } from '@/lib/api/agents'
import type { Agent } from '@/lib/types/agent'

export default function HomePage() {
  const [input, setInput] = useState('')
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  useEffect(() => {
    const loadAgents = async () => {
      const loadedAgents = await getAllAgents()
      setAgents(loadedAgents)
      setSelectedAgent(loadedAgents[0])
    }
    loadAgents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle interaction with selected agent here
    setInput('')
  }

  if (!selectedAgent) return null

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {selectedAgent.avatar && (
            <img
              src={selectedAgent.avatar}
              alt={selectedAgent.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{selectedAgent.name}</h1>
            <p className="text-white/60 text-sm">{selectedAgent.description}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {agents.map(agent => (
            <button
              key={agent.id}
              type="button"
              onClick={() => setSelectedAgent(agent)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedAgent.id === agent.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {agent.name}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 bg-gray-900 rounded-lg border border-white/10 focus:border-white/20 focus:outline-none"
            placeholder={`Send a message to ${selectedAgent.name}...`}
          />
          <button
            type="submit"
            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
} 