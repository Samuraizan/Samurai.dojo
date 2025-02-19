import { initialAgents } from '@/lib/services/agents'
import AgentCard from './components/AgentCard'

export default function AgentHub() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <a 
          href="/" 
          className="text-base text-white/70 hover:text-white transition-colors text-lg"
          style={{ transform: 'scale(1.3)' }}
        >
          ←
        </a>
        <span className="text-sm text-white/50">command center</span>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialAgents.map(agent => (
          <AgentCard key={agent.id} {...agent} />
        ))}
      </div>
    </div>
  )
} 