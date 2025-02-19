/**
 * API Type System
 * Core type definitions for API interactions
 */

/**
 * Base configuration for API clients
 */
export interface ApiClientConfig {
  /** API key for authentication */
  apiKey: string
  /** Base URL for API endpoints */
  baseUrl: string
  /** Optional timeout in milliseconds */
  timeout?: number
}

/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
  /** Response data of generic type T */
  data?: T
  /** Error information if request failed */
  error?: ApiError
  /** Response metadata */
  meta?: ResponseMetadata
}

/**
 * API error structure
 */
export interface ApiError {
  /** Error message */
  message: string
  /** Error code */
  code: string
  /** Optional stack trace for development */
  stack?: string
  /** Optional additional error details */
  details?: Record<string, unknown>
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  /** Timestamp of the response */
  timestamp: number
  /** Request ID for tracing */
  requestId?: string
  /** API version */
  version?: string
}

/**
 * Request options for API calls
 */
export interface RequestOptions extends RequestInit {
  /** Request timeout in milliseconds */
  timeout?: number
  /** Retry configuration */
  retry?: {
    /** Maximum number of retries */
    maxRetries: number
    /** Base delay between retries in milliseconds */
    baseDelay: number
    /** Maximum delay between retries in milliseconds */
    maxDelay: number
  }
}

/**
 * DeepSeek API specific types
 */
export namespace DeepSeekAPI {
  /** Chat completion request */
  export interface ChatRequest {
    /** Model identifier */
    model: string
    /** Array of chat messages */
    messages: Array<{
      /** Message role */
      role: 'user' | 'assistant' | 'system'
      /** Message content */
      content: string
    }>
    /** Temperature for response generation */
    temperature?: number
    /** Maximum tokens in response */
    max_tokens?: number
  }

  /** Chat completion response */
  export interface ChatResponse {
    /** ID of the completion */
    id: string
    /** Array of completion choices */
    choices: Array<{
      /** Index of the choice */
      index: number
      /** Message content */
      message: {
        /** Role of the message sender */
        role: 'assistant'
        /** Message content */
        content: string
      }
      /** Reason for finishing */
      finish_reason: 'stop' | 'length' | 'content_filter'
    }>
    /** Usage statistics */
    usage: {
      /** Prompt tokens used */
      prompt_tokens: number
      /** Completion tokens used */
      completion_tokens: number
      /** Total tokens used */
      total_tokens: number
    }
  }
} 