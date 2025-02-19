import type { Agent } from '@/lib/types/agent'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const AgentBadges = ({ agent }: { agent: Agent }) => (
  <div className="flex flex-wrap gap-2">
    <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
      {agent.status}
    </Badge>
    <Badge variant="outline">{agent.type}</Badge>
    {agent.capabilities.map(capability => (
      <Badge key={capability} variant="outline">
        {capability}
      </Badge>
    ))}
  </div>
)

export const AgentView = ({ agent }: { agent: Agent }) => (
  <Card className="p-6 max-w-2xl mx-auto">
    <div className="flex items-start gap-4">
      {agent.avatar && (
        <Image
          src={agent.avatar}
          alt={agent.name}
          width={100}
          height={100}
          className="rounded-lg object-cover"
          priority
        />
      )}
      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
          <p className="text-gray-600">{agent.description}</p>
        </div>
        <AgentBadges agent={agent} />
        {agent.type === 'ai' && (
          <div className="text-sm text-gray-500">
            Model: {agent.config.model}
          </div>
        )}
        {agent.type === 'human' && (
          <div className="text-sm text-gray-500">
            Role: {agent.role}
          </div>
        )}
      </div>
    </div>
  </Card>
) 