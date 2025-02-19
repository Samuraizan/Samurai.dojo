/**
 * Type System Index
 * Exports all type definitions
 */

// Agent Types
export * from './agent/types'

// API Types
export * from './api/types'

// Chat Types
export * from './chat/types'

// Component Types
export * from './component/types'

// Re-export commonly used types
export type {
  Agent,
  AgentType,
  AgentStatus,
  AgentRole,
  AgentConfig,
  AgentSkill,
} from './agent/types'

export type {
  ApiClientConfig,
  ApiResponse,
  ApiError,
  RequestOptions,
} from './api/types'

export type {
  ChatMessage,
  ChatResponse,
  ChatSession,
  MessageRole,
} from './chat/types'

export type {
  MotionProps,
  ButtonProps,
  CardProps,
  InputProps,
  ModalProps,
} from './component/types'

// Component Types
export interface MotionSectionProps {
  children: React.ReactNode
  className?: string
}

export interface AgentResponse extends ApiResponse<Agent> {}
export interface AgentsResponse extends ApiResponse<Agent[]> {} 