export type AgentStatus = 'active' | 'inactive'
export type AgentType = 'ai' | 'human'

export interface BaseAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  status: AgentStatus
  type: AgentType
  avatar?: string
}

export interface AIAgent extends BaseAgent {
  type: 'ai'
  config: {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt?: string
  }
}

export interface HumanAgent extends BaseAgent {
  type: 'human'
  role: string
}

export type Agent = AIAgent | HumanAgent

export const isAIAgent = (agent: Agent): agent is AIAgent => agent.type === 'ai'

export interface AgentConfig {
  modelName?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
} 