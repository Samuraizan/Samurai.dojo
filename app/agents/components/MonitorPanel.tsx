import { useState, useEffect } from 'react'
import type { Agent } from '@/lib/types/agent'

interface MonitorPanelProps {
  agent: Agent
  onClose: () => void
}

interface MetricData {
  label: string
  value: number
  unit: string
}

export function MonitorPanel({ agent, onClose }: MonitorPanelProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'Memory Usage', value: 0, unit: 'MB' },
    { label: 'Response Time', value: 0, unit: 'ms' },
    { label: 'Requests/min', value: 0, unit: 'rpm' }
  ])

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(current => 
        current.map(metric => ({
          ...metric,
          value: Math.floor(Math.random() * 100)
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="absolute inset-x-0 top-0 max-w-4xl mx-auto mt-20 p-6">
        <div className="bg-black border border-white/10 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-mono font-bold">
              {agent.name} Monitor
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {metrics.map(metric => (
              <div
                key={metric.label}
                className="border border-white/10 rounded-lg p-4"
              >
                <div className="text-sm text-white/60 mb-2">{metric.label}</div>
                <div className="text-2xl font-mono">
                  {metric.value}
                  <span className="text-sm text-white/40 ml-1">
                    {metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div className="p-4 border-t border-white/10">
            <h4 className="text-sm font-mono text-white/60 mb-2">Activity Log</h4>
            <div className="bg-white/5 rounded-lg p-4 h-40 overflow-y-auto font-mono text-sm">
              <div className="text-green-400">
                [System] Agent monitoring initialized...
              </div>
              <div className="text-white/60 mt-2">
                [Info] Collecting performance metrics...
              </div>
              <div className="text-yellow-400 mt-2">
                [Warning] High memory usage detected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 