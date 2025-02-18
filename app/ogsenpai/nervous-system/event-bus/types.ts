import type { Message } from '../../core/types';

export enum EventType {
  // Communication Events
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  MESSAGE_PROCESSED = 'MESSAGE_PROCESSED',
  RESPONSE_GENERATED = 'RESPONSE_GENERATED',
  
  // Agent Events
  AGENT_INITIALIZED = 'AGENT_INITIALIZED',
  AGENT_READY = 'AGENT_READY',
  AGENT_BUSY = 'AGENT_BUSY',
  AGENT_ERROR = 'AGENT_ERROR',
  
  // Task Events
  TASK_CREATED = 'TASK_CREATED',
  TASK_STARTED = 'TASK_STARTED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_FAILED = 'TASK_FAILED',
  
  // System Events
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SYSTEM_WARNING = 'SYSTEM_WARNING',
  SYSTEM_INFO = 'SYSTEM_INFO'
}

export interface Event {
  id: string;
  type: EventType;
  timestamp: number;
  data: unknown;
  source: string;
  target?: string;
}

export interface MessageEvent extends Event {
  data: {
    message: Message;
    metadata?: Record<string, unknown>;
  };
}

export interface AgentEvent extends Event {
  data: {
    agentId: string;
    status: string;
    metadata?: Record<string, unknown>;
  };
}

export interface TaskEvent extends Event {
  data: {
    taskId: string;
    status: string;
    result?: unknown;
    error?: Error;
    metadata?: Record<string, unknown>;
  };
}

export interface SystemEvent extends Event {
  data: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type EventCallback = (event: Event) => void | Promise<void>;

export interface EventSubscription {
  id: string;
  eventType: EventType;
  callback: EventCallback;
  filter?: (event: Event) => boolean;
} 