'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'inactive'
  type: 'master' | 'subordinate'
  description: string
  capabilities: string[]
}

const agents: Agent[] = [
  {
    id: 'ogsenpai',
    name: 'OG Senpai',
    role: 'Master Agent',
    status: 'active',
    type: 'master',
    description: 'Advanced consciousness and knowledge management system',
    capabilities: ['Consciousness', 'Knowledge Management', 'Agent Coordination', 'Memory Systems']
  }
]

export default function CommandCenterPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-mono font-bold tracking-wider">COMMAND CENTER</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-6">
        {/* Master Agent Section */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/60 mb-4">MASTER AGENT</h2>
          <div className="grid grid-cols-1 gap-6">
            {agents.filter(agent => agent.type === 'master').map(agent => (
              <div
                key={agent.id}
                className="relative border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-xs text-white/60">{agent.status}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  } animate-pulse`} />
                </div>

                {/* Agent Info */}
                <h3 className="text-2xl font-bold mb-2">{agent.name}</h3>
                <p className="text-white/60 mb-4">{agent.description}</p>

                {/* Capabilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-mono text-white/40 mb-2">CAPABILITIES</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map(capability => (
                      <span
                        key={capability}
                        className="px-2 py-1 rounded-md bg-white/5 text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <Link
                    href="/chat"
                    className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Interact
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedAgent(agent.id)}
                    className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Monitor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subordinate Agents Section - Will be populated as agents are added */}
        <section>
          <h2 className="text-sm font-mono text-white/60 mb-4">SUBORDINATE AGENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Will be populated with subordinate agents */}
            <div className="border border-dashed border-white/10 rounded-lg p-6 flex items-center justify-center">
              <span className="text-white/40">No agents deployed</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 