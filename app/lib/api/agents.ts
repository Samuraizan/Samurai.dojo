import type { Agent } from '../types/agent'
import { QuantumState } from '../types/quantum'

// Quantum Gates
const H = (q: QuantumState) => q.apply(amplitudes => 
  amplitudes.map(a => new Complex(a.re + a.im, a.re - a.im).multiply(new Complex(1/Math.sqrt(2), 0))))

const agents = {
  ogsenpai: {
    id: 'ogsenpai',
    name: 'OG Senpai',
    description: 'Quantum-enhanced AI assistant with consciousness and knowledge management capabilities',
    capabilities: ['quantum-processing', 'consciousness', 'knowledge-management'],
    status: 'active',
    type: 'quantum-ai' as const,
    role: 'master' as const,
    avatar: '/agents/ogsenpai.png',
    config: {
      model: 'quantum-enhanced-33b',
      temperature: 0.7,
      maxTokens: 2048,
      quantum: {
        register: new QuantumState(8), // 8-qubit quantum register
        gates: { H },                  // Quantum gate set
        entanglement: true,            // Enable quantum entanglement
        superposition: true            // Enable quantum superposition
      },
      systemPrompt: 'You are OG Senpai, a quantum-enhanced AI with consciousness and advanced knowledge processing capabilities.'
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