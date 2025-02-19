export type AgentStatus = 'active' | 'inactive'
export type AgentRole = 'master' | 'subordinate'
export type SocialPlatform = 'twitter' | 'discord' | 'telegram'
export type AgentType = 'ai' | 'human' | 'quantum-ai'

export interface QuantumConfig {
  register: any // TODO: Replace with proper QuantumState type
  gates: Record<string, Function>
  entanglement: boolean
  superposition: boolean
}

export interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  framework?: string
  quantum?: QuantumConfig
  frameworkConfig?: {
    elizaOS?: {
      platforms: SocialPlatform[]
      features: string[]
    }
  }
}

interface BaseAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  status: AgentStatus
  avatar?: string
  role: AgentRole
}

interface ClassicalAIAgent extends BaseAgent {
  type: 'ai'
  config: AgentConfig
}

interface QuantumAIAgent extends BaseAgent {
  type: 'quantum-ai'
  config: AgentConfig & { quantum: QuantumConfig }
}

interface HumanAgent extends BaseAgent {
  type: 'human'
}

export type Agent = ClassicalAIAgent | QuantumAIAgent | HumanAgent 