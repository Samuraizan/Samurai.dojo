import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import type { MemoryEntry, MemoryType, MemoryQuery, MemoryStats } from './types';
export * from './types';

export class MemoryManager {
  private static instance: MemoryManager;
  private memories: Map<string, MemoryEntry>;
  private readonly maxMemories: number;

  private constructor() {
    this.memories = new Map();
    this.maxMemories = 10000; // Maximum number of memories to store
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Store a new memory
   */
  store(
    type: MemoryType,
    content: unknown,
    metadata: Partial<MemoryEntry['metadata']>
  ): string {
    const id = uuidv4();
    const entry: MemoryEntry = {
      id,
      type,
      content,
      timestamp: Date.now(),
      metadata: {
        source: metadata.source || 'system',
        importance: metadata.importance || 0.5,
        context: metadata.context,
        associations: metadata.associations || [],
        lastAccessed: Date.now(),
        accessCount: 0
      }
    };

    this.memories.set(id, entry);
    this.enforceMemoryLimit();

    logger.debug('MemoryManager', `Memory stored: ${type}`, { id });
    return id;
  }

  /**
   * Retrieve a memory by ID
   */
  retrieve(id: string): MemoryEntry | null {
    const memory = this.memories.get(id);
    if (memory) {
      // Update access metadata
      memory.metadata.lastAccessed = Date.now();
      memory.metadata.accessCount = (memory.metadata.accessCount || 0) + 1;
      this.memories.set(id, memory);
    }
    return memory || null;
  }

  /**
   * Query memories based on criteria
   */
  query(query: MemoryQuery): MemoryEntry[] {
    let results = Array.from(this.memories.values());

    if (query.type) {
      results = results.filter(memory => memory.type === query.type);
    }

    if (query.timeRange) {
      const { start, end } = query.timeRange;
      results = results.filter(memory => 
        memory.timestamp >= start &&
        memory.timestamp <= end
      );
    }

    if (query.importance) {
      const { min, max } = query.importance;
      results = results.filter(memory =>
        memory.metadata.importance >= min &&
        memory.metadata.importance <= max
      );
    }

    if (query.context) {
      results = results.filter(memory =>
        memory.metadata.context === query.context
      );
    }

    if (query.associations) {
      results = results.filter(memory =>
        query.associations.some(tag =>
          memory.metadata.associations?.includes(tag)
        )
      );
    }

    // Sort by importance and timestamp
    results.sort((a, b) => {
      const importanceDiff = b.metadata.importance - a.metadata.importance;
      if (importanceDiff !== 0) return importanceDiff;
      return b.timestamp - a.timestamp;
    });

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Update a memory's content or metadata
   */
  update(id: string, updates: Partial<MemoryEntry>): boolean {
    const memory = this.memories.get(id);
    if (!memory) return false;

    const updated: MemoryEntry = {
      ...memory,
      ...updates,
      metadata: {
        ...memory.metadata,
        ...updates.metadata
      }
    };

    this.memories.set(id, updated);
    logger.debug('MemoryManager', `Memory updated: ${id}`);
    return true;
  }

  /**
   * Remove a memory
   */
  remove(id: string): boolean {
    const removed = this.memories.delete(id);
    if (removed) {
      logger.debug('MemoryManager', `Memory removed: ${id}`);
    }
    return removed;
  }

  /**
   * Get memory statistics
   */
  getStats(): MemoryStats {
    const memories = Array.from(this.memories.values());
    const totalImportance = memories.reduce(
      (sum, memory) => sum + memory.metadata.importance,
      0
    );

    const stats: MemoryStats = {
      totalEntries: memories.length,
      entriesByType: {} as Record<MemoryType, number>,
      averageImportance: totalImportance / memories.length || 0,
      oldestEntry: Math.min(...memories.map(m => m.timestamp)),
      newestEntry: Math.max(...memories.map(m => m.timestamp))
    };

    // Count entries by type
    for (const memory of memories) {
      const count = stats.entriesByType[memory.type] || 0;
      stats.entriesByType[memory.type] = count + 1;
    }

    return stats;
  }

  /**
   * Enforce memory limit by removing least important memories
   */
  private enforceMemoryLimit(): void {
    if (this.memories.size <= this.maxMemories) return;

    const memories = Array.from(this.memories.values())
      .sort((a, b) => a.metadata.importance - b.metadata.importance);

    const toRemove = memories.slice(0, this.memories.size - this.maxMemories);
    for (const memory of toRemove) {
      this.memories.delete(memory.id);
    }

    logger.debug('MemoryManager', `Removed ${toRemove.length} least important memories`);
  }
}

// Export singleton instance
export const memoryManager = MemoryManager.getInstance(); 