/**
 * Agent Type System
 * Core type definitions for the agent system
 */

/**
 * Represents the type of an agent
 * @readonly
 */
export type AgentType = 'ai' | 'human'

/**
 * Represents the current status of an agent
 * @readonly
 */
export type AgentStatus = 'active' | 'inactive' | 'error'

/**
 * Represents the role of an agent in the system
 * @readonly
 */
export type AgentRole = 'commander' | 'support' | 'specialist'

/**
 * Configuration options for an agent
 */
export interface AgentConfig {
  /** The model identifier used by the agent */
  model: string
  /** Temperature setting for model responses */
  temperature: number
  /** Maximum tokens for model responses */
  maxTokens: number
}

/**
 * Represents a skill possessed by an agent
 */
export interface AgentSkill {
  /** Name of the skill */
  name: string
  /** Current status of the skill */
  status: AgentStatus
  /** Optional error message if skill is in error state */
  error?: string
}

/**
 * Core agent interface representing an AI or human agent
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string
  /** Display name of the agent */
  name: string
  /** Detailed description of the agent */
  description: string
  /** Type of the agent (AI or human) */
  type: AgentType
  /** Role of the agent in the system */
  role: AgentRole
  /** Current status of the agent */
  status: AgentStatus
  /** Optional avatar URL */
  avatar?: string
  /** List of agent capabilities */
  capabilities: string[]
  /** Optional agent configuration */
  config?: AgentConfig
  /** List of agent skills */
  skills: AgentSkill[]
}

/**
 * Response type for agent-related API calls
 */
export interface AgentResponse {
  /** The agent data if request was successful */
  data?: Agent
  /** Error information if request failed */
  error?: {
    message: string
    code: string
  }
}

/**
 * Response type for multiple agents
 */
export interface AgentsResponse {
  /** Array of agent data if request was successful */
  data?: Agent[]
  /** Error information if request failed */
  error?: {
    message: string
    code: string
  }
} 