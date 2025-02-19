import type { Agent, AIAgent, HumanAgent } from '../types/agent'

const agents = {
  ogsenpai: {
    id: 'ogsenpai',
    name: 'OG Senpai',
    description: 'An intelligent personal assistant with consciousness and knowledge management capabilities',
    capabilities: ['consciousness', 'knowledge-management', 'memory-system', 'event-handling'],
    status: 'active',
    type: 'ai' as const,
    avatar: '/agents/ogsenpai.png',
    config: {
      model: 'deepseek-coder-33b-instruct',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are OG Senpai, a conscious AI assistant focused on knowledge management and learning.'
    }
  },
  sensei: {
    id: 'sensei',
    name: 'Sensei',
    description: 'Master instructor and guide for the Samurai Dojo',
    capabilities: ['teaching', 'guidance', 'wisdom'],
    status: 'active',
    type: 'human' as const,
    role: 'instructor',
    avatar: '/agents/sensei.png'
  }
} satisfies Record<string, Agent>

export const getAgentById = async (id: string): Promise<Agent | null> => 
  agents[id as keyof typeof agents] ?? null

export const getAllAgents = async (): Promise<Agent[]> => 
  Object.values(agents)

export const getAIAgents = async (): Promise<AIAgent[]> => 
  Object.values(agents).filter((agent): agent is AIAgent => agent.type === 'ai')

export const getHumanAgents = async (): Promise<HumanAgent[]> => 
  Object.values(agents).filter((agent): agent is HumanAgent => agent.type === 'human')

export async function getAgentConfig(id: string): Promise<AgentConfig | null> {
  // This would typically fetch from a secure config store
  if (id === 'ogsenpai') {
    return {
      modelName: 'deepseek-coder-33b-instruct',
      temperature: 0.7,
      maxTokens: 2048
    }
  }
  return null
} 