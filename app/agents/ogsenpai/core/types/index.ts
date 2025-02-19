/**
 * Core Types for OGSenpai Agent
 */

// Message Types
export interface Message {
  id: string;
  timestamp: number;
  type: MessageType;
  content: string;
  metadata?: Record<string, unknown>;
}

export enum MessageType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  INTERNAL = 'INTERNAL',
  ERROR = 'ERROR'
}

// Mind Module Types
export interface LLMRequest {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
}

export interface LLMResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, unknown>;
}

// Logger Types
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
}

// Agent Types
export type AgentType = 'ai' | 'human';

export interface AgentState {
  status: AgentStatus;
  currentTask?: string;
  lastActive: number;
  metrics: AgentMetrics;
}

export enum AgentStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

export interface AgentMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastError?: string;
} 