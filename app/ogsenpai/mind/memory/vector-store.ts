import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import { deepseek } from '../llm/deepseek';
import type { MemoryEntry } from './types';

interface VectorData {
  id: string;
  vector: number[];
  metadata: {
    memoryId: string;
    type: string;
    timestamp: number;
  };
}

export class VectorStore {
  private static instance: VectorStore;
  private vectors: Map<string, VectorData>;
  private dimensions: number;

  private constructor() {
    this.vectors = new Map();
    this.dimensions = 1536; // Default embedding dimensions
  }

  static getInstance(): VectorStore {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore();
    }
    return VectorStore.instance;
  }

  /**
   * Generate embedding for text content
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use DeepSeek to generate embeddings
      const result = await deepseek.generateResponse({
        prompt: text,
        model: 'deepseek-embed'
      });

      // Convert the response to a vector
      // This is a placeholder - actual implementation would depend on DeepSeek's embedding API
      const vector = new Array(this.dimensions).fill(0);
      return vector;
    } catch (error) {
      logger.error('VectorStore', 'Error generating embedding', { error });
      throw error;
    }
  }

  /**
   * Add a memory entry to the vector store
   */
  async addMemory(memory: MemoryEntry): Promise<string> {
    try {
      const content = typeof memory.content === 'string' 
        ? memory.content 
        : JSON.stringify(memory.content);

      const vector = await this.generateEmbedding(content);
      const vectorId = uuidv4();

      const vectorData: VectorData = {
        id: vectorId,
        vector,
        metadata: {
          memoryId: memory.id,
          type: memory.type,
          timestamp: memory.timestamp
        }
      };

      this.vectors.set(vectorId, vectorData);
      logger.debug('VectorStore', 'Vector stored', { vectorId, memoryId: memory.id });

      return vectorId;
    } catch (error) {
      logger.error('VectorStore', 'Error adding memory to vector store', { error });
      throw error;
    }
  }

  /**
   * Find similar memories using cosine similarity
   */
  async findSimilar(query: string, limit = 5): Promise<string[]> {
    try {
      const queryVector = await this.generateEmbedding(query);
      const similarities = Array.from(this.vectors.values())
        .map(data => ({
          memoryId: data.metadata.memoryId,
          similarity: this.cosineSimilarity(queryVector, data.vector)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return similarities.map(s => s.memoryId);
    } catch (error) {
      logger.error('VectorStore', 'Error finding similar memories', { error });
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Remove a vector from the store
   */
  removeVector(vectorId: string): boolean {
    return this.vectors.delete(vectorId);
  }

  /**
   * Clear all vectors
   */
  clear(): void {
    this.vectors.clear();
    logger.info('VectorStore', 'Vector store cleared');
  }
}

// Export singleton instance
export const vectorStore = VectorStore.getInstance(); 