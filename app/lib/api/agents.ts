import type { Agent } from '../types/agent'

const agents = {
  ogsenpai: {
    id: 'ogsenpai',
    name: 'OG Senpai',
    description: 'An intelligent personal assistant with consciousness and knowledge management capabilities',
    capabilities: ['consciousness', 'knowledge-management', 'memory-system', 'event-handling'],
    status: 'active',
    type: 'ai' as const,
    role: 'master' as const,
    avatar: '/agents/ogsenpai.png',
    config: {
      model: 'deepseek-coder-33b-instruct',
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are OG Senpai, a conscious AI assistant focused on knowledge management and learning.'
    }
  },
  vibe: {
    id: 'vibe',
    name: 'Vibe',
    description: 'Social media and community engagement agent powered by ElizaOS',
    capabilities: [
      'social-media-management',
      'sentiment-analysis',
      'content-generation',
      'community-engagement',
      'trend-analysis'
    ],
    status: 'active',
    type: 'ai' as const,
    role: 'subordinate' as const,
    avatar: '/agents/vibe.png',
    config: {
      model: 'gpt-4-turbo',
      temperature: 0.8,
      maxTokens: 1024,
      systemPrompt: 'You are Vibe, a social media expert focused on community engagement and trend analysis.',
      framework: 'elizaOS',
      frameworkConfig: {
        elizaOS: {
          platforms: ['twitter', 'discord', 'telegram'],
          features: [
            'auto-posting',
            'sentiment-tracking',
            'trend-detection',
            'engagement-optimization',
            'community-moderation'
          ]
        }
      }
    }
  }
} satisfies Record<string, Agent>

export const getAgentById = async (id: string): Promise<Agent | null> => 
  agents[id as keyof typeof agents] ?? null

export const getAllAgents = async (): Promise<Agent[]> => 
  Object.values(agents)

export const getMasterAgents = async (): Promise<Agent[]> =>
  Object.values(agents).filter(agent => agent.role === 'master')

export const getSubordinateAgents = async (): Promise<Agent[]> =>
  Object.values(agents).filter(agent => agent.role === 'subordinate') 