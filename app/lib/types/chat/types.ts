/**
 * Chat Type System
 * Core type definitions for chat functionality
 */

/**
 * Represents a chat message role
 * @readonly
 */
export type MessageRole = 'user' | 'ogsenpai' | 'system'

/**
 * Represents a chat message
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string
  /** Role of the message sender */
  role: MessageRole
  /** Content of the message */
  content: string
  /** Timestamp of when the message was sent */
  timestamp: number
  /** Optional agent ID if message is from an agent */
  agentId?: string
  /** Optional metadata for the message */
  metadata?: MessageMetadata
}

/**
 * Additional metadata for chat messages
 */
export interface MessageMetadata {
  /** Whether the message has been edited */
  edited?: boolean
  /** Timestamp of the last edit */
  editedAt?: number
  /** Original content before edits */
  originalContent?: string
  /** Array of reactions to the message */
  reactions?: MessageReaction[]
  /** References to other messages */
  references?: string[]
}

/**
 * Represents a reaction to a message
 */
export interface MessageReaction {
  /** Type of reaction */
  type: string
  /** Count of this reaction */
  count: number
  /** Array of user IDs who reacted */
  users: string[]
}

/**
 * Response from chat operations
 */
export interface ChatResponse {
  /** The message if operation was successful */
  message?: ChatMessage
  /** Error information if operation failed */
  error?: string
  /** Optional metadata about the operation */
  metadata?: ResponseMetadata
}

/**
 * Chat session information
 */
export interface ChatSession {
  /** Unique identifier for the session */
  id: string
  /** Title of the chat session */
  title: string
  /** Timestamp when the session was created */
  createdAt: number
  /** Timestamp of the last message */
  lastMessageAt: number
  /** Array of participant IDs */
  participants: string[]
  /** Optional session settings */
  settings?: ChatSettings
}

/**
 * Chat settings configuration
 */
export interface ChatSettings {
  /** Whether to enable message history */
  enableHistory: boolean
  /** Maximum number of messages to keep */
  maxMessages?: number
  /** Whether to enable message reactions */
  enableReactions: boolean
  /** Whether to enable message editing */
  enableEditing: boolean
  /** Custom theme settings */
  theme?: ChatTheme
}

/**
 * Chat theme configuration
 */
export interface ChatTheme {
  /** Primary color */
  primaryColor: string
  /** Background color */
  backgroundColor: string
  /** Text color */
  textColor: string
  /** Font family */
  fontFamily: string
} 