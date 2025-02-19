/**
 * Memory System Types for OGSenpai
 */

export interface MemoryEntry {
  id: string;
  type: MemoryType;
  content: unknown;
  timestamp: number;
  metadata: {
    source: string;
    importance: number;
    context?: string;
    associations?: string[];
    lastAccessed?: number;
    accessCount?: number;
  };
}

export enum MemoryType {
  // Short-term memory types
  CONVERSATION = 'CONVERSATION',
  CONTEXT = 'CONTEXT',
  WORKING_STATE = 'WORKING_STATE',

  // Long-term memory types
  KNOWLEDGE = 'KNOWLEDGE',
  EXPERIENCE = 'EXPERIENCE',
  RELATIONSHIP = 'RELATIONSHIP',
  SKILL = 'SKILL',

  // Working memory types
  TASK = 'TASK',
  GOAL = 'GOAL',
  PLAN = 'PLAN'
}

export interface MemoryQuery {
  type?: MemoryType;
  timeRange?: {
    start: number;
    end: number;
  };
  importance?: {
    min: number;
    max: number;
  };
  context?: string;
  associations?: string[];
  limit?: number;
}

export interface MemoryStats {
  totalEntries: number;
  entriesByType: Record<MemoryType, number>;
  averageImportance: number;
  oldestEntry: number;
  newestEntry: number;
} 