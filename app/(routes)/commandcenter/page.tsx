'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MonitorPanel } from '@/components/agents/MonitorPanel'
import { getAllAgents } from '@/lib/api/agents'
import type { Agent } from '@/lib/types/agent'

export default function CommandCenterPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentList = await getAllAgents()
        setAgents(agentList)
      } catch (error) {
        console.error('Failed to load agents:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  const monitoredAgent = selectedAgent 
    ? agents.find(a => a.id === selectedAgent)
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-mono">Loading agents...</div>
      </div>
    )
  }

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
        {/* Master Agents Section */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/60 mb-4">MASTER AGENTS</h2>
          <div className="grid grid-cols-1 gap-6">
            {agents
              .filter(agent => agent.role === 'master')
              .map(agent => (
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

        {/* Subordinate Agents Section */}
        <section>
          <h2 className="text-sm font-mono text-white/60 mb-4">SUBORDINATE AGENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents
              .filter(agent => agent.role === 'subordinate')
              .map(agent => (
                <div
                  key={agent.id}
                  className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
                >
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-mono">{agent.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">{agent.status}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      } animate-pulse`} />
                    </div>
                  </div>

                  {/* Framework Badge */}
                  {agent.type === 'ai' && agent.config.framework && (
                    <div className="mb-4">
                      <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs">
                        {agent.config.framework}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-white/60 mb-4">{agent.description}</p>

                  {/* Capabilities */}
                  <div className="mb-4">
                    <h4 className="text-xs font-mono text-white/40 mb-2">CAPABILITIES</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map(capability => (
                        <span
                          key={capability}
                          className="px-1.5 py-0.5 rounded bg-white/5 text-xs"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href="/chat"
                      className="flex-1 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors text-center text-sm"
                    >
                      Interact
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelectedAgent(agent.id)}
                      className="flex-1 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    >
                      Monitor
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      {/* Monitor Panel */}
      {monitoredAgent && (
        <MonitorPanel
          agent={monitoredAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  )
} 