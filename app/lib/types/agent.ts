export type AgentStatus = 'active' | 'inactive'
export type AgentRole = 'master' | 'subordinate'
export type SocialPlatform = 'twitter' | 'discord' | 'telegram'

export interface AgentConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  framework?: string
  frameworkConfig?: {
    elizaOS?: {
      platforms: SocialPlatform[]
      features: string[]
    }
  }
}

export interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
  status: AgentStatus
  type: 'ai'
  role: AgentRole
  avatar?: string
  config: AgentConfig
} 